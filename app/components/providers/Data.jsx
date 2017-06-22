import React from "react";
import PropTypes from "prop-types";
import Squel from "squel";

import meta from "resources/meta.json";
import config from "config.json";

// @FIXME remove this eventually
window.Squel = Squel;

const numBuckets = 5;

class DataProvider extends React.Component {

  static propTypes = {
    reach: PropTypes.bool,
    impact: PropTypes.bool,
    region: PropTypes.string,
    country: PropTypes.string,
  };

  static childContextTypes = {
    data: PropTypes.object,
    buckets: PropTypes.array,
    reach: PropTypes.bool,
    impact: PropTypes.bool,
    region: PropTypes.string,
    country: PropTypes.string,
  }

  constructor(...args) {
    super(...args);

    this.state = {
      loading: true,
      data: {},
    };

    // eslint-disable-next-line
    this.cartoSQL = window.cartodb.SQL({
      user: config.cartodb.account,
      sql_api_template: "https://{user}.cartodb.com",
    });
  }

  getChildContext() {
    return {
      data: this.state.data,
      buckets: this.state.buckets,
      reach: this.state.reach,
      impact: this.state.impact,
      region: this.state.region,
      country: this.state.country,
    };
  }

  fetchRemoteData() {
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

    let query = Squel.select().fields(fields).from("reach_data");

    if (this.props.country) {
      query = query.where("country = ?", this.props.country);
    }

    let getStatistics = new window.Promise((resolve, reject) => {
      this.cartoSQL.execute(query.toString())
        .done((result) => resolve(result))
        .error((error) => reject(error));
    });


    query = `WITH buckets as (
      SELECT NTILE(${numBuckets}) OVER(ORDER BY total_num_direct_participants + total_num_indirect_participants) AS position,
             total_num_direct_participants + total_num_indirect_participants AS total_participants
      FROM reach_data
    )
    SELECT buckets.position, MIN(buckets.total_participants) AS min, MAX(buckets.total_participants) AS max
    FROM buckets
    GROUP BY position
    ORDER BY position`;

    let getBuckets = new window.Promise((resolve, reject) => {
      this.cartoSQL.execute(query)
        .done((result) => resolve(result))
        .error((error) => reject(error));
    });

    window.Promise.all([getStatistics, getBuckets])
      .then(([statistics, buckets]) => {
        this.setState({
          data: statistics.rows[0],
          buckets: buckets.rows,
          reach: this.props.reach,
          impact: this.props.impact,
          region: this.props.region,
          country: this.props.country,
          loading: false,
        });
      });

  }

  componentDidMount() {
    this.fetchRemoteData();
  }

  componentWillReceiveProps() {
    this.setState({
      loading: false,
    }, () => {
      this.fetchRemoteData();
    });
  }

  render() {
    if (this.state.loading) {
      return (<h1>lodin</h1>);
    }

    return (<div>{this.props.children}</div>);
  }

}

export default DataProvider;
