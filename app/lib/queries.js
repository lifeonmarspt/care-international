import Squel from "squel";

import buckets from "resources/buckets.json";
// https://github.com/hiddentao/squel/issues/148
const SquelPostgres = Squel.useFlavour("postgres");
SquelPostgres.cls.DefaultQueryBuilderOptions.tableAliasQuoteCharacter = "\"";

const reachVariables = {
  overall: ["num_direct_participants", "num_indirect_participants"],
  hum: ["num_hum_direct_participants", "num_hum_indirect_participants"],
  wee: ["num_wee_direct_participants", "num_wee_indirect_participants"],
  srmh: ["num_srmh_direct_participants", "num_srmh_indirect_participants"],
  lffv: ["num_lffv_direct_participants", "num_lffv_indirect_participants"],
  fnscc: ["num_fnscc_direct_participants", "num_fnscc_indirect_participants"],
};

const getTextsSQL = () => {
  let query = SquelPostgres.select({ replaceSingleQuotes: true})
    .field("*")
    .from("messages");

  return query.toString();
};

const getReachMapCountriesSQL = (program) => {

  let directParticipantsVariable = reachVariables[program][0];
  let caseColumn = buckets.reach
    .map((bucket, n) => n + 1 < buckets.reach.length ?
      `WHEN ${directParticipantsVariable} BETWEEN ${bucket[0]} AND ${bucket[1]} THEN ${n + 1}` :
      `WHEN ${directParticipantsVariable} >= ${bucket[0]} THEN ${n + 1}`
    )
    .join(" ");
  let dataField = program === "overall" ? "data" : `${program}_data`;
  let fields = [
    "the_geom_webmercator",
    "country",
    "region",
    `'${program}' AS program`,
    `${dataField} AS data`,
    `CASE ${caseColumn} END AS bucket`,
    "category ILIKE '%member%' AS care_member",
  ];
  let query = SquelPostgres.select({ replaceSingleQuotes: true })
    .fields(fields)
    .from("reach_data")
    .where(`${dataField} IS NOT NULL`);

  return query.toString();

};

const getReachMapRegionsSQL = (program) => {

  let directParticipantsVariable = `SUM(${reachVariables[program][0]})`;
  let caseColumn = buckets.reach
    .map((bucket, n) => n + 1 < buckets.reach.length ?
      `WHEN ${directParticipantsVariable} BETWEEN ${bucket[0]} AND ${bucket[1]} THEN ${n + 1}` :
      `WHEN ${directParticipantsVariable} >= ${bucket[0]} THEN ${n + 1}`
    )
    .join(" ");
  let fields = [
    "regions_complete_geometries.the_geom_webmercator AS the_geom_webmercator",
    "reach_data.region",
    `'${program}' AS program`,
    "1 AS data",
    `CASE ${caseColumn} END AS bucket`,
    "false as care_member",
  ];
  let query = SquelPostgres.select({ replaceSingleQuotes: true })
    .fields(fields)
    .from("reach_data")
    .join("regions_complete_geometries", null, "reach_data.region = regions_complete_geometries.region")
    .group("reach_data.region, regions_complete_geometries.the_geom_webmercator");

  return query.toString();

};

const getReachStatisticsCountriesSQL = (country) => {
  let fields = [
    "fnscc_data::BOOL AS has_fnscc_data",
    "hum_data::BOOL AS has_hum_data",
    "lffv_data::BOOL AS has_lffv_data",
    "wee_data::BOOL AS has_wee_data",
    "srmh_data::BOOL AS has_srmh_data",
    "data::BOOL AS has_overall_data",
    "comment AS comment",
    "num_fnscc_direct_participants AS fnscc_direct_participants",
    "num_fnscc_indirect_participants AS fnscc_indirect_participants",
    "num_fnscc_projects_and_initiatives AS fnscc_projects_and_initiatives",
    "num_hum_direct_participants AS hum_direct_participants",
    "num_hum_indirect_participants AS hum_indirect_participants",
    "num_hum_projects_and_initiatives AS hum_projects_and_initiatives",
    "num_lffv_direct_participants AS lffv_direct_participants",
    "num_lffv_indirect_participants AS lffv_indirect_participants",
    "num_lffv_projects_and_initiatives AS lffv_projects_and_initiatives",
    "num_wee_direct_participants AS wee_direct_participants",
    "num_wee_indirect_participants AS wee_indirect_participants",
    "num_wee_projects_and_initiatives AS wee_projects_and_initiatives",
    "num_srmh_direct_participants AS srmh_direct_participants",
    "num_srmh_indirect_participants AS srmh_indirect_participants",
    "num_srmh_projects_and_initiatives AS srmh_projects_and_initiatives",
    "num_direct_participants AS overall_direct_participants",
    "num_indirect_participants AS overall_indirect_participants",
    "num_projects_and_initiatives AS overall_projects_and_initiatives",
    "COALESCE(percent_women_of_direct_participants, 0) * num_direct_participants AS overall_direct_participants_women",
    "COALESCE(percent_women_of_indirect_participants, 0) * num_indirect_participants AS overall_indirect_participants_women",
    "COALESCE(percent_fnscc_women_direct_participants, 0) * num_fnscc_direct_participants AS fnscc_direct_participants_women",
    "COALESCE(percent_fnscc_women_indirect_participants, 0) * num_fnscc_indirect_participants AS fnscc_indirect_participants_women",
    "COALESCE(percent_hum_women_direct_participants, 0) * num_hum_direct_participants AS hum_direct_participants_women",
    "COALESCE(percent_hum_women_indirect_participants, 0) * num_hum_indirect_participants AS hum_indirect_participants_women",
    "COALESCE(percent_lffv_women_direct_participants, 0) * num_lffv_direct_participants AS lffv_direct_participants_women",
    "COALESCE(percent_lffv_women_indirect_participants, 0) * num_lffv_indirect_participants AS lffv_indirect_participants_women",
    "COALESCE(percent_wee_women_direct_participants, 0) * num_wee_direct_participants AS wee_direct_participants_women",
    "COALESCE(percent_wee_women_indirect_participants, 0) * num_wee_indirect_participants AS wee_indirect_participants_women",
    "COALESCE(percent_srmh_women_direct_participants, 0) * num_srmh_direct_participants AS srmh_direct_participants_women",
    "COALESCE(percent_srmh_women_indirect_participants, 0) * num_srmh_indirect_participants AS srmh_indirect_participants_women",
  ];

  let query = SquelPostgres.select({ replaceSingleQuotes: true })
    .fields(fields)
    .from("reach_data")
    .where("country = ?", country || "Total");

  return query.toString();
};

const getReachStatisticsRegionsSQL = (region) => {
  let fields = [
    "true AS has_fnscc_data",
    "true AS has_hum_data",
    "true AS has_lffv_data",
    "true AS has_wee_data",
    "true AS has_srmh_data",
    "true AS has_overall_data",
    "SUM(num_fnscc_direct_participants) AS fnscc_direct_participants",
    "SUM(num_fnscc_indirect_participants) AS fnscc_indirect_participants",
    "SUM(num_fnscc_projects_and_initiatives) AS fnscc_projects_and_initiatives",
    "SUM(num_hum_direct_participants) AS hum_direct_participants",
    "SUM(num_hum_indirect_participants) AS hum_indirect_participants",
    "SUM(num_hum_projects_and_initiatives) AS hum_projects_and_initiatives",
    "SUM(num_lffv_direct_participants) AS lffv_direct_participants",
    "SUM(num_lffv_indirect_participants) AS lffv_indirect_participants",
    "SUM(num_lffv_projects_and_initiatives) AS lffv_projects_and_initiatives",
    "SUM(num_wee_direct_participants) AS wee_direct_participants",
    "SUM(num_wee_indirect_participants) AS wee_indirect_participants",
    "SUM(num_wee_projects_and_initiatives) AS wee_projects_and_initiatives",
    "SUM(num_srmh_direct_participants) AS srmh_direct_participants",
    "SUM(num_srmh_indirect_participants) AS srmh_indirect_participants",
    "SUM(num_srmh_projects_and_initiatives) AS srmh_projects_and_initiatives",
    "SUM(num_direct_participants) AS overall_direct_participants",
    "SUM(num_indirect_participants) AS overall_indirect_participants",
    "SUM(num_projects_and_initiatives) AS overall_projects_and_initiatives",
    "SUM(COALESCE(percent_women_of_direct_participants, 0) * num_direct_participants) AS overall_direct_participants_women",
    "SUM(COALESCE(percent_women_of_indirect_participants, 0) * num_indirect_participants) AS overall_indirect_participants_women",
    "SUM(COALESCE(percent_fnscc_women_direct_participants, 0) * num_fnscc_direct_participants) AS fnscc_direct_participants_women",
    "SUM(COALESCE(percent_fnscc_women_indirect_participants, 0) * num_fnscc_indirect_participants) AS fnscc_indirect_participants_women",
    "SUM(COALESCE(percent_hum_women_direct_participants, 0) * num_hum_direct_participants) AS hum_direct_participants_women",
    "SUM(COALESCE(percent_hum_women_indirect_participants, 0) * num_hum_indirect_participants) AS hum_indirect_participants_women",
    "SUM(COALESCE(percent_lffv_women_direct_participants, 0) * num_lffv_direct_participants) AS lffv_direct_participants_women",
    "SUM(COALESCE(percent_lffv_women_indirect_participants, 0) * num_lffv_indirect_participants) AS lffv_indirect_participants_women",
    "SUM(COALESCE(percent_wee_women_direct_participants, 0) * num_wee_direct_participants) AS wee_direct_participants_women",
    "SUM(COALESCE(percent_wee_women_indirect_participants, 0) * num_wee_indirect_participants) AS wee_indirect_participants_women",
    "SUM(COALESCE(percent_srmh_women_direct_participants, 0) * num_srmh_direct_participants) AS srmh_direct_participants_women",
    "SUM(COALESCE(percent_srmh_women_indirect_participants, 0) * num_srmh_indirect_participants) AS srmh_indirect_participants_women",
  ];

  let query = SquelPostgres.select({ replaceSingleQuotes: true })
    .fields(fields)
    .from("reach_data")
    .where("region = ?", region)
    .group("region");

  return query.toString();
};


const getImpactStatisticsSQL = (region, country) => {
  let fields = [
    "ROUND(SUM(total_impact)) AS overall_impact",
    "ROUND(SUM(humanitarian_response)) AS hum_impact",
    "ROUND(SUM(sexual_reproductive_and_maternal_health)) AS srmh_impact",
    "ROUND(SUM(right_to_a_life_free_from_violence)) AS lffv_impact",
    "ROUND(SUM(food_and_nutrition_security_and_resilience_to_climate_change)) AS fnscc_impact",
    "ROUND(SUM(women_s_economic_empowerment)) AS wee_impact",
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

const getImpactRegionDataSQL = (region) => {

  let caseColumn = (caseVariable) => buckets.impact
    .map((bucket, n) => n + 1 < buckets.reach.length ?
      `WHEN ${caseVariable} BETWEEN ${bucket[0]} AND ${bucket[1]} THEN ${bucket[2]}` :
      `WHEN ${caseVariable} >= ${bucket[0]} THEN ${bucket[2]}`
    )
    .join(" ");

  let subfields = [
    "ST_Centroid(ST_Collect(the_geom)) AS region_center",
    "ROUND(SUM(total_impact)) AS overall_impact",
    `CASE ${caseColumn("SUM(total_impact)")} END AS overall_size`,
    "ROUND(SUM(humanitarian_response)) AS hum_impact",
    `CASE ${caseColumn("SUM(humanitarian_response)")} END AS hum_size`,
    "ROUND(SUM(sexual_reproductive_and_maternal_health)) AS srmh_impact",
    `CASE ${caseColumn("SUM(sexual_reproductive_and_maternal_health)")} END AS srmh_size`,
    "ROUND(SUM(right_to_a_life_free_from_violence)) AS lffv_impact",
    `CASE ${caseColumn("SUM(right_to_a_life_free_from_violence)")} END AS lffv_size`,
    "ROUND(SUM(food_and_nutrition_security_and_resilience_to_climate_change)) AS fnscc_impact",
    `CASE ${caseColumn("SUM(food_and_nutrition_security_and_resilience_to_climate_change)")} END AS fnscc_size`,
    "ROUND(SUM(women_s_economic_empowerment)) AS wee_impact",
    `CASE ${caseColumn("SUM(women_s_economic_empowerment)")} END AS wee_size`,
  ];

  if (!region) {
    subfields.push("region");
  } else {
    subfields.push("country");
  }

  let subquery = SquelPostgres.select({ replaceSingleQuotes: true })
    .fields(subfields)
    .from("impact_data");

  if (!region) {
    subquery = subquery.group("region");
  } else {
    subquery = subquery.where("region = ?", region);
    subquery = subquery.group("country");
  }

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

const getImpactStoriesSQL = () => {
  let fields = [
    "*",
    "ST_X(the_geom) AS lon",
    "ST_Y(the_geom) as lat",
  ];

  let query = SquelPostgres.select({ replaceSingleQuotes: true })
    .fields(fields)
    .from("story");

  return query.toString();
};

const getBoundsSQL = (table, region, country) => {
  let query = SquelPostgres.select({ replaceSingleQuotes: true }).field("the_geom").from(table);

  if (country) {
    query = query.where("country = ?", country);
  } else if (region) {
    // Fiji's geometry has points lying on both sides of the 180º longitude line
    // this causes issues with cartojs's get bounds function.
    query = query.where("region = ? and country != 'Fiji'", region);
  }


  return query.toString();
};

export {
  getTextsSQL,
  getReachStatisticsCountriesSQL,
  getReachStatisticsRegionsSQL,
  getReachMapCountriesSQL,
  getReachMapRegionsSQL,
  getImpactStatisticsSQL,
  getImpactRegionDataSQL,
  getImpactStoriesSQL,
  getBoundsSQL,
};
