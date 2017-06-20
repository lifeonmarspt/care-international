import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

import RadioButton from "components/elements/Radio";
import PercentageBar from "components/elements/PercentageBar";
import ValueBar from "components/elements/ValueBar";

import imgCare from "images/care.png";
import "./style.sass";

import filters from "resources/mock/reach.json";

class SidebarArea extends React.Component {

  static propTypes = {
    reach: PropTypes.bool,
    impact: PropTypes.bool,
    region: PropTypes.string,
    country: PropTypes.string,
    data: PropTypes.object.isRequired,
  };

  render() {
    return (<div id="sidebar">

      <div className="logo">
        <img alt="care" src={imgCare} />
      </div>

      <div className="menu">
        <ul className="menu">
          <li>
            <NavLink to="/reach" activeClassName="active">reach</NavLink>
          </li>
          <li>
            <NavLink to="/impact" activeClassName="active">impact</NavLink>
          </li>
        </ul>
      </div>

      <div className="breadcrumbs">
        World
      </div>

      <div className="content">
        <dl>
          <dt>Projects and Initiatives</dt>
          <dd>{this.props.data.sum_num_projects_and_initiatives.toLocaleString()}</dd>
          <dt>Participants reached</dt>
          <dd>
            <ul>
              <li>
                <div>Direct (?)</div>
                <PercentageBar value={this.props.data.sum_women_total_direct_particip}
                  maxValue={this.props.data.sum_total_num_direct_participants}>
                  {this.props.data.sum_total_num_direct_participants.toLocaleString()}
                </PercentageBar>
              </li>
              <li>
                <div>Indirect (?)</div>
                <PercentageBar value={this.props.data.sum_women_total_indirect_particip}
                  maxValue={this.props.data.sum_total_num_indirect_participants}>
                  {this.props.data.sum_total_num_indirect_participants.toLocaleString()}
                </PercentageBar>
              </li>
            </ul>
          </dd>
        </dl>
      </div>

      <div className="filters">
        <h1>Filter by outcome</h1>
        <ul>
          {filters.map((filter, n) => (<li key={n}>
            <RadioButton id={`radio-${n}`} name="outcome-filter">{filter.name}</RadioButton>
            <ValueBar value={filter.values.direct}
              maxValue={filter.values.direct*3}
              colorClass={filter.id}>
              {filter.values.direct.toLocaleString()} direct
            </ValueBar>
            <ValueBar value={filter.values.indirect}
              maxValue={filter.values.indirect*1.4}
              colorClass={filter.id}>
              {filter.values.indirect.toLocaleString()} indirect
            </ValueBar>
          </li>))}
        </ul>
      </div>
    </div>);

  }

}

export default SidebarArea;
