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

    let {
      loading,
      mainView,
      subView,
      program,
      region,
      country,
      statistics,
      stories,
      handleProgramChange,
      handleToggleSidebar,
      handleAboutDirectReachClick,
      handleAboutIndirectReachClick,
    } = this.props;

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
          loading={loading}
          mainView={mainView}
          subView={subView}
          region={region}
          country={country}
          program={program}
          statistics={statistics}
          handleProgramChange={handleProgramChange}
          handleAboutDirectReachClick={handleAboutDirectReachClick}
          handleAboutIndirectReachClick={handleAboutIndirectReachClick}
          handleToggleSidebar={handleToggleSidebar}
        />)}

        {mainView === "impact" && (<ImpactSidebar
          loading={loading}
          mainView={mainView}
          region={region}
          country={country}
          program={program}
          statistics={statistics}
          stories={stories}
          handleProgramChange={handleProgramChange}
          handleToggleSidebar={handleToggleSidebar}
        />)}

        {program !== "overall" && (<div className="clear-filters">
          <ul>
            <li className="see-overall">
              <AppLink className="secondary" mainView={mainView} subView={subView} region={region} country={country}>
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
