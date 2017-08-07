import buckets from "resources/buckets.json";

const reachVariables = {
  overall: ["num_direct_participants", "num_indirect_participants"],
  hum: ["num_hum_direct_participants", "num_hum_indirect_participants"],
  wee: ["num_wee_direct_participants", "num_wee_indirect_participants"],
  srmh: ["num_srmh_direct_participants", "num_srmh_indirect_participants"],
  lffv: ["num_lffv_direct_participants", "num_lffv_indirect_participants"],
  fnscc: ["num_fnscc_direct_participants", "num_fnscc_indirect_participants"],
};

const getTextsSQL = () => {
  return "SELECT * FROM messages";
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

  return `SELECT ${fields.join(", ")} FROM reach_data WHERE ${dataField} IS NOT NULL`;

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

  return `SELECT ${fields.join(", ")} FROM reach_data INNER JOIN regions_complete_geometries ON reach_data.region = regions_complete_geometries.region GROUP BY reach_data.region, regions_complete_geometries.the_geom_webmercator`;

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

  return `SELECT ${fields.join(", ")} FROM reach_data WHERE country = '${country || "Total"}'`;
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

  return `SELECT ${fields.join(", ")} FROM reach_data WHERE region = '${region}'`;
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

  let query = `SELECT ${fields.join(", ")} FROM impact_data`;

  if (country) {
    query += ` WHERE country = '${country}'`;
  } else if (region) {
    query += ` WHERE region = '${region}'`;
  } else if (region && country) {
    query += ` WHERE country = '${country}' AND region = '${region}'`;
  }

  return query;
};

const getImpactRegionDataSQL = (region) => {

  let caseColumn = (caseVariable) => buckets.impact
    .map((bucket, n) => n + 1 < buckets.impact.length ?
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

  let subquery = `SELECT ${subfields.join(", ")} FROM impact_data`;


  if (!region) {
    subquery += " GROUP BY region";
  } else {
    subquery += ` WHERE region = '${region}'`;
    subquery += " GROUP BY country";
  }

  let fields = [
    "ST_X(region_center) AS region_center_x",
    "ST_Y(region_center) AS region_center_y",
    "*",
  ];

  return `SELECT ${fields.join(", ")} FROM (${subquery}) sq`;
};

const getImpactStoriesSQL = () => {
  const bounds = ["XMIN", "XMAX", "YMIN", "YMAX"].map(s => `ST_${s}(ST_EXTENT(i.the_geom)) AS ${s}`).join(",");
  return [
    "SELECT g.*, s.*, ST_X(s.the_geom) AS lon, ST_Y(s.the_geom) AS lat",
    "FROM story s INNER JOIN (",
    `  SELECT story_number, ${bounds}`,
    "  FROM story s INNER JOIN impact_data i ON s.iso = i.iso",
    "  GROUP BY story_number",
    ") g ON s.story_number = g.story_number",
  ].join(" ");
};

const getBoundsSQL = (table, region, country) => {
  let query = `SELECT the_geom FROM ${table}`;

  if (country) {
    query += ` WHERE country = '${country}'`;
  } else if (region) {
    // Fiji's geometry has points lying on both sides of the 180º longitude line
    // this causes issues with cartojs's get bounds function.
    query += ` WHERE region = '${region}' AND country != 'Fiji'`;
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
