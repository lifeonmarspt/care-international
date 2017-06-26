import { getReachStatisticsSQL, getReachBucketsSQL } from "lib/queries";
import config from "config.json";

const cartoSQL = window.cartodb.SQL({
  user: config.cartodb.account,
  sql_api_template: "https://{user}.cartodb.com",
});

const fetchRemoteData = (country, program) => {

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

export { fetchRemoteData };
