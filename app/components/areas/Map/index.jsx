import React from "react";
import PropTypes from "prop-types";

import ReachMap from "./Reach";
import ImpactMap from "./Impact";

import imgHelp from "images/help.svg";

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
      />)}

      {this.props.mainView === "impact" && (<ImpactMap
        mainView={this.props.mainView}
        region={this.props.region}
        country={this.props.country}
        program={this.props.program}
        regions={this.props.regions}
        stories={this.props.stories}
        handleMapChange={this.props.handleMapChange}
      />)}

      <div id="about-data">
        <div className="clickable" onClick={this.props.handleAboutClick}>
          <span>
            About {this.props.mainView} data
          </span>
          <img src={imgHelp} alt="Help" />
        </div>
      </div>

    </div>);
  }
}

export default MapArea;
