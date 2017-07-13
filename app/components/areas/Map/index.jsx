import React from "react";
import PropTypes from "prop-types";

import ReachMap from "components/areas/Map/Reach";
import ImpactMap from "components/areas/Map/Impact";

import "./style.scss";

class MapArea extends React.Component {

  static propTypes = {
    mainView: PropTypes.oneOf([
      "reach",
      "impact",
    ]).isRequired,
    subView: PropTypes.oneOf([
      "countries",
      "regions",
    ]),
    country: PropTypes.string,
    bounds: PropTypes.array,
    program: PropTypes.string,
    region: PropTypes.string,
    regions: PropTypes.array,
    stories: PropTypes.array,
    handleMapChange: PropTypes.func,
    handleAboutClick: PropTypes.func.isRequired,
  };

  render() {
    return (<div id="map-area">

      {this.props.mainView === "reach" && (<ReachMap
        mainView={this.props.mainView}
        subView={this.props.subView}
        country={this.props.country}
        program={this.props.program}
        regions={this.props.regions}
        handleMapChange={this.props.handleMapChange}
        handleAboutClick={this.props.handleAboutClick}
      />)}

      {this.props.mainView === "impact" && (<ImpactMap
        mainView={this.props.mainView}
        region={this.props.region}
        country={this.props.country}
        program={this.props.program}
        regions={this.props.regions}
        stories={this.props.stories}
        handleMapChange={this.props.handleMapChange}
        handleAboutClick={this.props.handleAboutClick}
      />)}

    </div>);
  }
}

export default MapArea;
