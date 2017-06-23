import React from "react";
import PropTypes from "prop-types";
import queryString from "query-string";

import Header from "components/areas/Header";
import Map from "components/areas/Map";
import Sidebar from "components/areas/Sidebar";

import { fetchRemoteData } from "lib/remote";

class App extends React.Component {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    reach: PropTypes.bool,
    impact: PropTypes.bool,
    region: PropTypes.string,
    country: PropTypes.string,
  };

  constructor(...args) {
    super(...args);

    let qs = queryString.parse(this.context.router.route.location.search);

    this.state = {
      loading: true,
      outcome: qs.outcome,
    };
  }

  handleOutcomeChange(outcome) {
    let qs = queryString.stringify({
      outcome: outcome,
    });

    let location = this.context.router.route.location.pathname +
      (qs ? `?${qs}` : "");

    this.setState({
      outcome: outcome,
    }, () => {
      this.context.router.history.push(location);
    });

  }

  handleCountryChange(country) {
    let qs = queryString.stringify({
      outcome: this.state.outcome,
    });

    let url = "/reach/" + encodeURIComponent(country) +
      (qs ? `?${qs}` : "");
    this.context.router.history.push(url);
  }

  fetchRemoteData() {
    fetchRemoteData(this.props.country, this.state.outcome || "overall")
      .then(([statistics, buckets]) => {
        this.setState({
          loading: false,
          statistics: statistics.rows[0],
          buckets: buckets.rows,
          reach: this.props.reach,
          impact: this.props.impact,
          region: this.props.region,
          country: this.props.country,
        });
      });
  }

  componentDidMount() {
    this.fetchRemoteData();
  }

  componentWillReceiveProps() {
    this.fetchRemoteData();
  }

  render() {
    if (this.state.loading) {
      return (<h1>LOADIN'</h1>);
    }

    return (<div id="app">
      <Header />
      <Map
        outcome={this.state.outcome}
        buckets={this.state.buckets}
        handleCountryChange={this.handleCountryChange.bind(this)}
      />
      <Sidebar
        statistics={this.state.statistics}
        buckets={this.state.buckets}
        reach={this.state.reach}
        impact={this.state.impact}
        region={this.state.region}
        country={this.state.country}
        outcome={this.state.outcome}
        handleOutcomeChange={this.handleOutcomeChange.bind(this)}
      />

    </div>);
  }
}

export default App;
