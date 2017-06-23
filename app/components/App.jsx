import React from "react";
import PropTypes from "prop-types";
import queryString from "query-string";

import Header from "components/areas/Header";
import Map from "components/areas/Map";
import Sidebar from "components/areas/Sidebar";

import { fetchRemoteData } from "lib/remote";

class App extends React.PureComponent {

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

    this.state = {
      loading: true,
    };
  }

  navigate(reach, impact, country, outcome) {
    let qs = queryString.stringify({
      outcome: outcome,
    });

    let parts = [];

    if (reach) {
      parts.push("reach");
    }

    if (impact) {
      parts.push("impact");
    }

    if (country) {
      parts.push(encodeURIComponent(country));
    }

    let location = "/" + parts.join("/") + (qs ? `?${qs}` : "");

    this.context.router.history.push(location);

  }

  handleOutcomeChange(outcome) {
    this.navigate(this.state.reach, this.state.impact, this.state.country, outcome);
  }

  handleCountryChange(country) {
    console.log("navigating to", country);
    this.navigate(this.state.reach, this.state.impact, country, this.state.outcome);
  }


  fetchRemoteData() {
    console.log("fetching", this.props);
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
          outcome: this.props.outcome,
        });
      });
  }

  componentDidMount() {
    this.fetchRemoteData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.fetchRemoteData();
    }
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
