import React from "react";
import PropTypes from "prop-types";

import LeafletProvider from "components/providers/Leaflet";
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

  static defaultProps = {
    program: "overall",
  }

  constructor(...args) {
    super(...args);

    this.state = {
      loading: true,
      statistics: {},
      bounds: null,
      reach: false,
      impact: false,
    };
  }

  navigate(reach, impact, region, country, program) {
    let location = getLocation(reach, impact, region, country, program);
    this.context.router.history.push(location);
  }

  handleProgramChange(program) {
    this.navigate(this.state.reach, this.state.impact, this.state.region, this.state.country, program);
  }

  handleCountryChange(country) {
    this.navigate(this.state.reach, this.state.impact, this.state.region, country, this.state.program);
  }

  handleRegionChange(region) {
    this.navigate(this.state.reach, this.state.impact, region, this.state.country, this.state.program);
  }

  fetchRemoteData() {
    // lol ifs ¯\_(ツ)_/¯
    if (this.props.reach) {
      fetchReachData(this.props.country, this.props.program)
        .then(([statistics, bounds]) => {
          this.setState({
            loading: false,
            statistics: statistics.rows[0],
            bounds: bounds,
            reach: this.props.reach,
            impact: this.props.impact,
            region: this.props.region,
            country: this.props.country,
            program: this.props.program,
          });
        });
    } else if (this.props.impact) {
      fetchImpactData(this.props.region, this.props.country)
        .then(([statistics, regions]) => {
          this.setState({
            loading: false,
            statistics: statistics.rows[0],
            regions: regions.rows,
            reach: this.props.reach,
            impact: this.props.impact,
            region: this.props.region,
            country: this.props.country,
            program: this.props.program,
          });
        });
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
      <SidebarComponent
        loading={this.state.loading}
        statistics={this.state.statistics}
        region={this.state.region}
        country={this.state.country}
        program={this.state.program}
        handleProgramChange={this.handleProgramChange.bind(this)}
      />
      <LeafletProvider bounds={this.state.bounds}>
        <MapComponent
          country={this.state.country}
          program={this.state.program}
          regions={this.state.regions}
          handleCountryChange={this.handleCountryChange.bind(this)}
          handleRegionChange={this.handleRegionChange.bind(this)}
        />
      </LeafletProvider>
    </div>);
  }
}

export default App;
