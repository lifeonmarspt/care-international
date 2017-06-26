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
      statistics: {},
      buckets: [],
      reach: false,
      impact: false,
    };
  }

  navigate(reach, impact, country, program) {
    let qs = queryString.stringify({
      program: program,
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

  handleProgramChange(program) {
    this.navigate(this.state.reach, this.state.impact, this.state.country, program);
  }

  handleCountryChange(country) {
    this.navigate(this.state.reach, this.state.impact, country, this.state.program);
  }


  fetchRemoteData() {
    fetchRemoteData(this.props.country, this.state.program || "overall")
      .then(([statistics, buckets]) => {
        this.setState({
          loading: false,
          statistics: statistics.rows[0],
          buckets: buckets.rows,
          reach: this.props.reach,
          impact: this.props.impact,
          region: this.props.region,
          country: this.props.country,
          program: this.props.program,
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
    return (<div id="app">
      <Header />
      <Map
        country={this.state.country}
        program={this.state.program}
        buckets={this.state.buckets}
        handleCountryChange={this.handleCountryChange.bind(this)}
      />
      <Sidebar
        loading={this.state.loading}
        statistics={this.state.statistics}
        buckets={this.state.buckets}
        reach={this.state.reach}
        impact={this.state.impact}
        region={this.state.region}
        country={this.state.country}
        program={this.state.program}
        handleProgramChange={this.handleProgramChange.bind(this)}
      />

    </div>);
  }
}

export default App;
