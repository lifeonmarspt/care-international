import React from "react";
import PropTypes from "prop-types";

import RadioButton from "components/elements/Radio";
import PercentageBar from "components/elements/PercentageBar";
import ValueBar from "components/elements/ValueBar";

import "./style.sass";

import meta from "resources/meta.json";

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
          {meta.variables.map((variable, n) => {

            let directValue = this.props.data[`sum_num_${variable.id}_direct_particip`];
            let indirectValue = this.props.data[`sum_num_${variable.id}_indirect_particip`];
            let maxValue = directValue + indirectValue;

            return (<li key={n}>
              <RadioButton id={`radio-${n}`} name="outcome-filter">{variable.name}</RadioButton>
              <ValueBar value={directValue}
                maxValue={maxValue}
                colorClass={variable.id}>
                {directValue.toLocaleString()} direct
              </ValueBar>
              <ValueBar value={indirectValue}
                maxValue={maxValue}
                colorClass={variable.id}>
                {indirectValue.toLocaleString()} indirect
              </ValueBar>
            </li>);

          })}
        </ul>
      </div>
    </div>);

  }

}

export default SidebarArea;
