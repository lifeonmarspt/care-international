import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import AppLink from "components/elements/AppLink";
import ReachSidebar from "./Reach";
import ImpactSidebar from "./Impact";

import navigationProps from "props/navigation";

import "./style.scss";

class SidebarArea extends React.Component {

  static propTypes = {
    loading: PropTypes.bool.isRequired,

    navigation: navigationProps.isRequired,

    data: PropTypes.shape({
      statistics: PropTypes.object,
      regions: PropTypes.array,
      bounds: PropTypes.array,
      stories: PropTypes.array,
    }).isRequired,

    handlers: PropTypes.shape({
      handleProgramChange: PropTypes.func.isRequired,
      handleAboutDirectReachClick: PropTypes.func,
      handleAboutIndirectReachClick: PropTypes.func,
    }).isRequired,
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

    let {
      loading,
    } = this.props;

    let {
      mainView,
      subView,
      region,
      country,
      program,
    } = this.props.navigation;

    if (!program) {
      program = "overall";
    }

    let {
      statistics,
      stories,
    } = this.props.data;

    let {
      handleProgramChange,
      handleAboutDirectReachClick,
      handleAboutIndirectReachClick,
    } = this.props.handlers;

    if (loading) {
      return (<div id="sidebar" />);
    }

    let sidebarClassNames = classnames({
      "breadcrumbs": true,
      "desktop-breadcrumbs-visible": country || region,
      "mobile-sidebar-visible": this.state.mobileSidebarVisible,
    });

    return (<div id="sidebar" className={sidebarClassNames}>

      <div className="mobile-sidebar-show" onClick={() => this.handleToggleSidebar()} />

      <div className="breadcrumbs">
        <ul>
          <li>
            <AppLink
              mainView={mainView}
              program={program}
            >
              World
            </AppLink>
          </li>
          {region && country && (<li>
            <AppLink
              mainView={mainView}
              program={program}
              region={region}
            >
              {region}
            </AppLink>
          </li>)}
          {region && !country && (<li>{region}</li>)}
          {country && (<li>{country}</li>)}
        </ul>
        <div className="mobile-sidebar-hide" onClick={() => this.handleToggleSidebar()} />
      </div>

      <div className="sidebar-content">

        {mainView === "reach" && (<ReachSidebar
          program={program}
          country={country}
          statistics={statistics}
          handleProgramChange={handleProgramChange}
          handleAboutDirectReachClick={handleAboutDirectReachClick}
          handleAboutIndirectReachClick={handleAboutIndirectReachClick}
        />)}

        {mainView === "impact" && (<ImpactSidebar
          program={program}
          statistics={statistics}
          stories={stories}
          handleProgramChange={handleProgramChange}
        />)}

        {program !== "overall" && (<div className="clear-filters">
          <ul>
            <li className="see-overall">
              <AppLink
                className="secondary"
                mainView={mainView}
                subView={subView}
                region={region}
                country={country}
              >
                See all program areas
              </AppLink>
            </li>
          </ul>
        </div>)}

      </div>

    </div>);
  }
}

export default SidebarArea;
