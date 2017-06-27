import Squel from "squel";

// https://github.com/hiddentao/squel/issues/148
const SquelPostgres = Squel.useFlavour("postgres");
SquelPostgres.cls.DefaultQueryBuilderOptions.tableAliasQuoteCharacter = "\"";

const numBuckets = 5;

const numImpactBuckets = 3;

const reachVariables = {
  overall: ["num_direct_participants", "num_indirect_participants"],
  hum: ["num_hum_direct_participants", "num_hum_indirect_participants"],
  wee: ["num_wee_direct_participants", "num_wee_indirect_participants"],
  srmh: ["num_srmh_direct_participants", "num_srmh_indirect_participants"],
  lffv: ["num_lffv_direct_participants", "num_lffv_indirect_participants"],
  fnscc: ["num_fnscc_direct_participants", "num_fnscc_indirect_participants"],
};

const impactVariables = {
  overall: "total_impact",
  hum: "humanitarian_response",
  wee: "women_s_economic_empowerment",
  srmh: "sexual_reproductive_and_maternal_health",
  lffv: "right_to_a_life_free_from_violence",
  fnscc: "food_and_nutrition_security_and_resilience_to_climate_change",
};

const getReachMapSQL = (program)  => {
  const whereClause = reachVariables[program].map((f) => `${f} IS NOT NULL`).join(" AND ");

  let fields = [
    "*",
    `CASE WHEN ${whereClause} THEN NTILE(${numBuckets}) OVER(PARTITION BY ${whereClause} ORDER BY ${reachVariables[program].join("+")}) ELSE null END AS bucket`,
    "category ILIKE '%member%' AS care_member",
  ];
  let query = SquelPostgres.select({ replaceSingleQuotes: true }).fields(fields).from("reach_data");

  return query.toString();

};

const getReachBucketsSQL = (program) => {
  let query = `WITH buckets as (
    SELECT NTILE(${numBuckets}) OVER(ORDER BY ${reachVariables[program].join("+")}) AS position,
           ${reachVariables[program]} AS total_participants
    FROM reach_data
    WHERE ${reachVariables[program].map((f) => `${f} IS NOT NULL`).join(" AND ")}
  )
  SELECT buckets.position, MIN(buckets.total_participants) AS min, MAX(buckets.total_participants) AS max
  FROM buckets
  GROUP BY position
  ORDER BY position`;

  return query;
};

const getReachStatisticsSQL = (country) => {
  let fields = [
    "SUM(num_fnscc_direct_participants) AS fnscc_direct_participants",
    "SUM(num_fnscc_indirect_participants) AS fnscc_indirect_participants",
    "SUM(num_hum_direct_participants) AS hum_direct_participants",
    "SUM(num_hum_indirect_participants) AS hum_indirect_participants",
    "SUM(num_lffv_direct_participants) AS lffv_direct_participants",
    "SUM(num_lffv_indirect_participants) AS lffv_indirect_participants",
    "SUM(num_wee_direct_participants) AS wee_direct_participants",
    "SUM(num_wee_indirect_participants) AS wee_indirect_participants",
    "SUM(num_srmh_direct_participants) AS srmh_direct_participants",
    "SUM(num_srmh_indirect_participants) AS srmh_indirect_participants",
    "SUM(num_projects_and_initiatives) AS projects_and_initiatives",
    "SUM(num_direct_participants) AS total_direct_participants",
    "SUM(num_indirect_participants) AS total_indirect_participants",
    "SUM(COALESCE(percent_women_of_direct_participants, 0) * num_direct_participants) AS total_direct_participants_women",
    "SUM(COALESCE(percent_women_of_indirect_participants, 0) * num_indirect_participants) AS total_indirect_participants_women",
  ];

  let query = SquelPostgres.select({ replaceSingleQuotes: true })
    .fields(fields)
    .from("reach_data");

  if (country) {
    query = query.where("country = ?", country);
  }

  return query.toString();
};

const getImpactStatisticsSQL = (region, country) => {
  let fields = [
    "SUM(total_impact) AS total_impact",
    "SUM(humanitarian_response) AS hum_impact",
    "SUM(sexual_reproductive_and_maternal_health) AS srmh_impact",
    "SUM(right_to_a_life_free_from_violence) AS lffv_impact",
    "SUM(food_and_nutrition_security_and_resilience_to_climate_change) AS fnscc_impact",
    "SUM(women_s_economic_empowerment) AS wee_impact",
  ];

  let query = SquelPostgres.select({ replaceSingleQuotes: true })
    .fields(fields)
    .from("impact_data");

  if (country) {
    query = query.where("country = ?", country);
  }

  if (region) {
    query = query.where("region = ?", region);
  }

  return query.toString();
};

const getImpactRegionDataSQL = () => {

  let subfields = [
    "region",
    "ST_Centroid(ST_Union(the_geom)) AS region_center",
    "SUM(total_impact) AS total_impact",
    "SUM(humanitarian_response) AS hum_impact",
    "SUM(sexual_reproductive_and_maternal_health) AS srmh_impact",
    "SUM(right_to_a_life_free_from_violence) AS lffv_impact",
    "SUM(food_and_nutrition_security_and_resilience_to_climate_change) AS fnscc_impact",
    "SUM(women_s_economic_empowerment) AS wee_impact",
  ];

  let subquery = SquelPostgres.select({ replaceSingleQuotes: true })
    .fields(subfields)
    .from("impact_data")
    .group("region");

  let fields = [
    "ST_X(region_center) AS region_center_x",
    "ST_Y(region_center) AS region_center_y",
    "*",
  ];

  let query = SquelPostgres.select()
    .fields(fields)
    .from(subquery, "sq");

  return query.toString();

};

const getImpactBucketsSQL = (program) => {
  let query = `WITH buckets as (
    SELECT NTILE(${numImpactBuckets}) OVER(ORDER BY SUM(${impactVariables[program]}) DESC) AS position,
           SUM(${impactVariables[program]}) AS impact,
           region AS region
    FROM impact_data
    WHERE ${impactVariables[program]} IS NOT NULL
    GROUP BY region
  )
  SELECT buckets.position, buckets.region, buckets.impact
  FROM buckets
  GROUP BY position, region, impact
  ORDER BY position`;

  return query;
};

const getBoundsSQL = (table, country) => {
  let query = SquelPostgres.select({ replaceSingleQuotes: true }).field("the_geom").from(table);

  if (country) {
    query = query.where("country = ?", country);
  }

  return query.toString();
};

export {
  numBuckets,
  getReachStatisticsSQL,
  getReachBucketsSQL,
  getReachMapSQL,
  getImpactStatisticsSQL,
  getImpactRegionDataSQL,
  getImpactBucketsSQL,
  getBoundsSQL,
};
