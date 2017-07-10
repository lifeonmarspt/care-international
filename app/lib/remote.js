import {
  getTextsSQL,
  getReachStatisticsCountriesSQL,
  getReachStatisticsRegionsSQL,
  getImpactStatisticsSQL,
  getImpactRegionDataSQL,
  getImpactStoriesSQL,
  getBoundsSQL,
} from "lib/queries";
import config from "config.json";

// eslint-disable-next-line
const cartoSQL = window.cartodb.SQL({
  user: config.cartodb.account,
  sql_api_template: "https://{user}.carto.com",
});

const getBounds = (table, region, country) => {
  return new window.Promise((resolve, reject) => {
    cartoSQL.getBounds(getBoundsSQL(table, region, country))
      .done((result) => resolve(result))
      .error((error) => reject(error));
  });
};

const getTexts = () => {
  return new window.Promise((resolve, reject) => {
    cartoSQL.execute(getTextsSQL())
      .done((result) => {
        let indexed = result.rows.reduce((accumulator, value) => {
          accumulator[value.about] = value;
          return accumulator;
        }, {});
        resolve(indexed);
      })
      .error((error) => reject(error));
  });
};

const fetchReachData = (region, country) => {
  let sql = region ?
    getReachStatisticsRegionsSQL(region) :
    getReachStatisticsCountriesSQL(country);

  let getStatistics = new window.Promise((resolve, reject) => {
    cartoSQL.execute(sql)
      .done((result) => resolve(result))
      .error((error) => reject(error));
  });

  return window.Promise.all([
    getTexts(),
    getStatistics,
    (region || country) && getBounds("reach_data", region, country),
  ]);
};

const fetchImpactData = (region, country) => {
  let getStatistics = new window.Promise((resolve, reject) => {
    cartoSQL.execute(getImpactStatisticsSQL(region, country))
      .done((result) => resolve(result))
      .error((error) => reject(error));
  });

  let getRegionData = new window.Promise((resolve, reject) => {
    cartoSQL.execute(getImpactRegionDataSQL(region))
      .done((result) => resolve(result))
      .error((error) => reject(error));
  });

  let getStories = new window.Promise((resolve, reject) => {
    cartoSQL.execute(getImpactStoriesSQL())
      .done((result) => resolve(result))
      .error((error) => reject(error));
  });

  return window.Promise.all([
    getTexts(),
    getStatistics,
    getRegionData,
    getStories,
    (region || country) && getBounds("impact_data", region, country),
  ]);
};

export {
  fetchReachData,
  fetchImpactData,
};
