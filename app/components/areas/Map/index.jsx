import React from "react";
import PropTypes from "prop-types";

import ReachMap from "./Reach";
import ImpactMap from "./Impact";

import navigationProps from "props/navigation";

import imgHelp from "images/help.svg";
import "./style.scss";

class MapArea extends React.Component {

  static propTypes = {
    navigation: navigationProps.isRequired,

    data: PropTypes.shape({
      regions: PropTypes.array,
      stories: PropTypes.array,
    }).isRequired,

    handlers: PropTypes.shape({
      handleMapChange: PropTypes.func,
      handleAboutClick: PropTypes.func.isRequired,
    }).isRequired,
  };

  render() {
    let { navigation, data, handlers } = this.props;

    return (<div id="map-area">

      {navigation.mainView === "reach" && (<ReachMap
        subView={navigation.subView}
        program={navigation.program}
        handleMapChange={handlers.handleMapChange}
      />)}

      {navigation.mainView === "impact" && (<ImpactMap
        program={navigation.program}
        story={navigation.story}
        regions={data.regions}
        stories={data.stories}
        handleMapChange={handlers.handleMapChange}
      />)}

      <div id="about-data">
        <div className="clickable" onClick={handlers.handleAboutClick}>
          <span>
            About {navigation.mainView} data
          </span>
          <img src={imgHelp} alt="Help" />
        </div>
      </div>

    </div>);
  }
}

export default MapArea;
