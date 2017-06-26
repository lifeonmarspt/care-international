import React from "react";
import PropTypes from "prop-types";

import Header from "components/areas/Header";
import ReachMap from "components/areas/Map/Reach";
import ReachSidebar from "components/areas/Sidebar/Reach";
import ImpactMap from "components/areas/Map/Impact";
import ImpactSidebar from "components/areas/Sidebar/Impact";

import getLocation from "lib/location";
import { fetchReachData, fetchImpactData } from "lib/remote";

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
    let location = getLocation(reach, impact, country, program);
    this.context.router.history.push(location);
  }

  handleProgramChange(program) {
    this.navigate(this.state.reach, this.state.impact, this.state.country, program);
  }

  handleCountryChange(country) {
    this.navigate(this.state.reach, this.state.impact, country, this.state.program);
  }


  fetchRemoteData() {
    // lol ifs ¯\_(ツ)_/¯
    if (this.props.reach) {
      fetchReachData(this.props.country, this.state.program || "overall")
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
    } else if (this.props.impact) {
      fetchImpactData(this.props.region, this.props.country)
        .then((statistics) => {
          this.setState({
            loading: false,
            statistics: statistics.rows[0],
            reach: this.props.reach,
            impact: this.props.impact,
            region: this.props.region,
            country: this.props.country,
            program: this.props.program,
          });
        });
    } else {
      console.error("derp omg");
    }
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
    let MapComponent = this.props.reach ? ReachMap : ImpactMap;
    let SidebarComponent = this.props.reach ? ReachSidebar : ImpactSidebar;

    return (<div id="app">
      <Header />
      <MapComponent
        country={this.state.country}
        program={this.state.program}
        buckets={this.state.buckets}
        handleCountryChange={this.handleCountryChange.bind(this)}
      />
      <SidebarComponent
        loading={this.state.loading}
        statistics={this.state.statistics}
        buckets={this.state.buckets}
        region={this.state.region}
        country={this.state.country}
        program={this.state.program}
        handleProgramChange={this.handleProgramChange.bind(this)}
      />
    </div>);
  }
}

export default App;
