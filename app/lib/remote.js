import {
  getReachStatisticsSQL,
  getReachBucketsSQL,
  getImpactStatisticsSQL,
  getImpactRegionDataSQL,
  getImpactBucketsSQL,
  getBoundsSQL,
} from "lib/queries";
import config from "config.json";

// eslint-disable-next-line
const cartoSQL = window.cartodb.SQL({
  user: config.cartodb.account,
  sql_api_template: "https://{user}.carto.com",
});

const fetchReachData = (country, program) => {
  let getStatistics = new window.Promise((resolve, reject) => {
    cartoSQL.execute(getReachStatisticsSQL(country))
      .done((result) => resolve(result))
      .error((error) => reject(error));
  });

  let getBuckets = new window.Promise((resolve, reject) => {
    cartoSQL.execute(getReachBucketsSQL(program))
      .done((result) => resolve(result))
      .error((error) => reject(error));
  });

  return window.Promise.all([getStatistics, getBuckets]);
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

  return window.Promise.all([getStatistics, getRegionData]);
};

const fetchBounds = (table, country) => {
  return new window.Promise((resolve, reject) => {
    cartoSQL.getBounds(getBoundsSQL(table, country))
      .done((result) => resolve(result))
      .error((error) => reject(error));
  });
};

export {
  fetchReachData,
  fetchImpactData,
  fetchBounds,
};
