import React from "react";
import PropTypes from "prop-types";

import Squel from "squel";
window.Squel = Squel;

import config from "config.json";

class DataProvider extends React.Component {

  static propTypes = {
    reach: PropTypes.bool,
    impact: PropTypes.bool,
    region: PropTypes.string,
    country: PropTypes.string,
  };

  static childContextTypes = {
    data: PropTypes.object,
  }

  constructor(...args) {
    super(...args);

    this.state = {
      loading: true,
      data: {},
    };

    // eslint-disable-next-line
    this.cartoSQL = window.cartodb.SQL({ user: config.cartodb.account, sql_api_template: "https://{user}.cartodb.com" });
  }

  getChildContext() {
    return {
      data: this.state.data,
    };
  }

  fetchRemoteData() {
    let fields = [
      "SUM(num_fnscc_direct_particip) as sum_num_fnscc_direct_particip",
      "SUM(num_fnscc_indirect_particip) as sum_num_fnscc_indirect_particip",
      "SUM(num_hum_direct_particip) as sum_num_hum_direct_particip",
      "SUM(num_hum_indirect_particip) as sum_num_hum_indirect_particip",
      "SUM(num_lffv_direct_particip) as sum_num_lffv_direct_particip",
      "SUM(num_lffv_indirect_particip) as sum_num_lffv_indirect_particip",
      "SUM(num_wee_direct_particip) as sum_num_wee_direct_particip",
      "SUM(num_wee_indirect_particip) as sum_num_wee_indirect_particip",
      "SUM(num_srmh_direct_particip) as sum_num_srmh_direct_particip",
      "SUM(num_srmh_indirect_particip) as sum_num_srmh_indirect_particip",
      "SUM(num_projects_and_initiatives) AS sum_num_projects_and_initiatives",
      "SUM(total_num_direct_participants) AS sum_total_num_direct_participants",
      "SUM(total_num_indirect_participants) AS sum_total_num_indirect_participants",
      "SUM(COALESCE(percent_women_direct_particip, 0) * total_num_direct_participants) AS sum_women_total_direct_particip",
      "SUM(COALESCE(percent_women_indirect_particip, 0) * total_num_indirect_participants) AS sum_women_total_indirect_particip",
    ];

    let query = Squel.select().fields(fields).from("reach_data");

    if (this.props.country) {
      query = query.where("country = ?", this.props.country);
    }

    this.cartoSQL.execute(query.toString())
      .done((result) => {
        this.setState({
          loading: false,
          data: result.rows[0],
        });
      });
  }

  componentDidMount() {
    this.fetchRemoteData();
  }

  componentWillReceiveProps() {
    this.setState({
      loading: true,
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
