import React from "react";
import PropTypes from "prop-types";

import ReachSidebar from "./Reach";
import ImpactSidebar from "./Impact";

import "./style.scss";

class SidebarArea extends React.Component {

  static propTypes = {
    loading: PropTypes.bool.isRequired,
    mainView: PropTypes.oneOf([
      "reach",
      "impact",
    ]).isRequired,
    subView: PropTypes.oneOf([
      "countries",
      "regions",
    ]),
    statistics: PropTypes.object.isRequired,
    region: PropTypes.string,
    country: PropTypes.string,
    program: PropTypes.string,
    stories: PropTypes.array,
    handleProgramChange: PropTypes.func.isRequired,
    handleToggleSidebar: PropTypes.func.isRequired,
    handleAboutDirectReachClick: PropTypes.func,
    handleAboutIndirectReachClick: PropTypes.func,
  }

  render() {

    if (this.props.loading) {
      return (<div id="sidebar" />);
    }

    return (<div id="sidebar">

      <div id="mobile-sidebar" onClick={this.props.handleToggleSidebar} />

      {this.props.mainView === "reach" && (<ReachSidebar
        loading={this.props.loading}
        mainView={this.props.mainView}
        subView={this.props.subView}
        region={this.props.region}
        country={this.props.country}
        program={this.props.program}
        statistics={this.props.statistics}
        handleProgramChange={this.props.handleProgramChange}
        handleAboutDirectReachClick={this.props.handleAboutDirectReachClick}
        handleAboutIndirectReachClick={this.props.handleAboutIndirectReachClick}
        handleToggleSidebar={this.props.handleToggleSidebar}
      />)}

      {this.props.mainView === "impact" && (<ImpactSidebar
        loading={this.props.loading}
        mainView={this.props.mainView}
        region={this.props.region}
        country={this.props.country}
        program={this.props.program}
        statistics={this.props.statistics}
        stories={this.props.stories}
        handleProgramChange={this.props.handleProgramChange}
        handleToggleSidebar={this.props.handleToggleSidebar}
      />)}

    </div>);
  }
}

export default SidebarArea;
