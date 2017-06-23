import Squel from "squel";

const numBuckets = 5;

const variables = {
  overall: ["total_num_direct_participants", "total_num_indirect_participants"],
  hum: ["num_hum_direct_particip", "num_hum_indirect_particip"],
  wee: ["num_wee_direct_particip", "num_wee_indirect_particip"],
  srmh: ["num_srmh_direct_particip", "num_srmh_indirect_particip"],
  lffv: ["num_lffv_direct_particip", "num_lffv_indirect_particip"],
  fnscc: ["num_fnscc_direct_particip", "num_fnscc_indirect_particip"],
};

const getReachMapSQL = (outcome)  => {
  const whereClause = variables[outcome].map((f) => `${f} IS NOT NULL`).join(" AND ");

  let fields = [
    "*",
    `CASE WHEN ${whereClause} THEN NTILE(${numBuckets}) OVER(PARTITION BY ${whereClause} ORDER BY ${variables[outcome].join("+")}) ELSE null END AS bucket`,
    "category ILIKE '%member%' AS care_member",
  ];
  let query = Squel.select({ replaceSingleQuotes: true }).fields(fields).from("reach_data");

  return query.toString();

};

const getReachBucketsSQL = (outcome) => {
  let query = `WITH buckets as (
    SELECT NTILE(${numBuckets}) OVER(ORDER BY ${variables[outcome].join("+")}) AS position,
           ${variables[outcome]} AS total_participants
    FROM reach_data
    WHERE ${variables[outcome].map((f) => `${f} IS NOT NULL`).join(" AND ")}
  )
  SELECT buckets.position, MIN(buckets.total_participants) AS min, MAX(buckets.total_participants) AS max
  FROM buckets
  GROUP BY position
  ORDER BY position`;

  return query;
};

const getReachStatisticsSQL = (country) => {

  let fields = [
    "SUM(num_fnscc_direct_particip) AS fnscc_direct_participants",
    "SUM(num_fnscc_indirect_particip) AS fnscc_indirect_participants",
    "SUM(num_hum_direct_particip) AS hum_direct_participants",
    "SUM(num_hum_indirect_particip) AS hum_indirect_participants",
    "SUM(num_lffv_direct_particip) AS lffv_direct_participants",
    "SUM(num_lffv_indirect_particip) AS lffv_indirect_participants",
    "SUM(num_wee_direct_particip) AS wee_direct_participants",
    "SUM(num_wee_indirect_particip) AS wee_indirect_participants",
    "SUM(num_srmh_direct_particip) AS srmh_direct_participants",
    "SUM(num_srmh_indirect_particip) AS srmh_indirect_participants",
    "SUM(num_projects_and_initiatives) AS projects_and_initiatives",
    "SUM(total_num_direct_participants) AS total_direct_participants",
    "SUM(total_num_indirect_participants) AS total_indirect_participants",
    "SUM(COALESCE(percent_women_direct_particip, 0) * total_num_direct_participants) AS total_direct_participants_women",
    "SUM(COALESCE(percent_women_indirect_particip, 0) * total_num_indirect_participants) AS total_indirect_participants_women",
  ];

  let query = Squel.select({ replaceSingleQuotes: true }).fields(fields).from("reach_data");

  if (country) {
    query = query.where("country = ?", country);
  }

  return query.toString();
};


export { numBuckets, getReachStatisticsSQL, getReachBucketsSQL, getReachMapSQL };
