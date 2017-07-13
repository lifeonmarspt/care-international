import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import AppLink from "components/elements/AppLink";
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
    handleAboutDirectReachClick: PropTypes.func,
    handleAboutIndirectReachClick: PropTypes.func,
  }

  constructor(...args) {
    super(...args);
    this.state = {
      mobileSidebarVisible: false,
    };
  }

  handleToggleSidebar() {
    this.setState({
      mobileSidebarVisible: !this.state.mobileSidebarVisible,
    });
  }

  render() {

    if (this.props.loading) {
      return (<div id="sidebar" />);
    }

    let sidebarClassNames = classnames({
      "breadcrumbs": true,
      "desktop-breadcrumbs-visible": this.props.country || this.props.region,
      "mobile-sidebar-visible": this.state.mobileSidebarVisible,
    });

    return (<div id="sidebar" className={sidebarClassNames}>

      <div className="mobile-sidebar-show" onClick={() => this.handleToggleSidebar()}>
        ➡
      </div>

      <div className="breadcrumbs">
        <ul>
          <li>
            <AppLink
              mainView={this.props.mainView}
              program={this.props.program}
            >
              World
            </AppLink>
          </li>
          {this.props.region && this.props.country && (<li>
            <AppLink
              mainView={this.props.mainView}
              program={this.props.program}
              region={this.props.region}
            >
              {this.props.region}
            </AppLink>
          </li>)}
          {this.props.region && !this.props.country && (<li>{this.props.region}</li>)}
          {this.props.country && (<li>{this.props.country}</li>)}
        </ul>
        <div className="mobile-sidebar-hide" onClick={() => this.handleToggleSidebar()}>
          Map ⬅
        </div>
      </div>

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
