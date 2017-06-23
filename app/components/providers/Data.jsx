import React from "react";
import PropTypes from "prop-types";

import { getReachStatisticsSQL, getReachBucketsSQL } from "lib/queries";
import config from "config.json";

class DataProvider extends React.Component {

  static propTypes = {
    reach: PropTypes.bool,
    impact: PropTypes.bool,
    outcome: PropTypes.string,
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

  static defaultProps = {
    outcome: "overall",
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

    let getStatistics = new window.Promise((resolve, reject) => {
      this.cartoSQL.execute(getReachStatisticsSQL(this.props.country))
        .done((result) => resolve(result))
        .error((error) => reject(error));
    });

    let getBuckets = new window.Promise((resolve, reject) => {
      this.cartoSQL.execute(getReachBucketsSQL(this.props.outcome))
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
