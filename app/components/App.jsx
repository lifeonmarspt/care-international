import React from "react";
import PropTypes from "prop-types";

import Header from "components/areas/Header";
import LeafletWrapper from "components/wrappers/Leaflet";
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
    mainView: PropTypes.oneOf([
      "reach",
      "impact",
    ]),
    subView: PropTypes.oneOf([
      "regions",
      "countries",
    ]),
    region: PropTypes.string,
    country: PropTypes.string,
    program: PropTypes.string,
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
      mainView: null,
      subView: null,
    };
  }

  navigate(options) {
    let location = getLocation(options);
    this.context.router.history.push(location);
  }

  handleProgramChange(program) {
    this.navigate({
      mainView: this.state.mainView,
      subView: this.state.subView,
      region: this.state.region,
      country: this.state.country,
      program,
    });
  }

  handleCountryChange(country) {
    this.navigate({
      mainView: this.state.mainView,
      subView: this.state.subView,
      region: this.state.region,
      country,
      program: this.state.program,
    });
  }

  handleRegionChange(region) {
    this.navigate({
      mainView: this.state.mainView,
      subView: this.state.subView,
      region,
      country: this.state.country,
      program: this.state.program,
    });
  }

  fetchRemoteData() {
    switch (this.props.mainView) {

      case "reach":
        fetchReachData(this.props.country, this.props.program)
          .then(([statistics, bounds]) => {
            this.setState({
              loading: false,
              statistics: statistics.rows[0],
              bounds: bounds,
              mainView: this.props.mainView,
              subView: this.props.subView,
              region: this.props.region,
              country: this.props.country,
              program: this.props.program,
            });
          });
        break;

      case "impact":
        fetchImpactData(this.props.region, this.props.country)
          .then(([statistics, regions]) => {
            this.setState({
              loading: false,
              statistics: statistics.rows[0],
              regions: regions.rows,
              mainView: this.props.mainView,
              subView: this.props.subView,
              region: this.props.region,
              country: this.props.country,
              program: this.props.program,
            });
          });
        break;

      default:
        // eslint-disable-next-line
        console.error("wat");
        break;
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
    switch (this.props.mainView) {

      case "reach":
        return (<div id="app">
          <Header />
          <ReachSidebar
            loading={this.state.loading}
            subView={this.state.subView}
            statistics={this.state.statistics}
            region={this.state.region}
            country={this.state.country}
            program={this.state.program}
            handleProgramChange={this.handleProgramChange.bind(this)}
          />
          <LeafletWrapper bounds={this.state.bounds}>
            <ReachMap
              subView={this.state.subView}
              country={this.state.country}
              program={this.state.program}
              regions={this.state.regions}
              handleCountryChange={this.handleCountryChange.bind(this)}
              handleRegionChange={this.handleRegionChange.bind(this)}
            />
          </LeafletWrapper>
        </div>);

      case "impact":
        return (<div id="app">
          <Header />
          <ImpactSidebar
            subView={this.state.subView}
            loading={this.state.loading}
            statistics={this.state.statistics}
            region={this.state.region}
            country={this.state.country}
            program={this.state.program}
            handleProgramChange={this.handleProgramChange.bind(this)}
          />
          <LeafletWrapper bounds={this.state.bounds}>
            <ImpactMap
              subView={this.state.subView}
              country={this.state.country}
              program={this.state.program}
              regions={this.state.regions}
              handleCountryChange={this.handleCountryChange.bind(this)}
              handleRegionChange={this.handleRegionChange.bind(this)}
            />
          </LeafletWrapper>
        </div>);

      default:
        // eslint-disable-next-line
        console.error("wat");
        break;
    }
  }
}

export default App;
