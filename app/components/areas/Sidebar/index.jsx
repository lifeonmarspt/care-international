import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import RadioButton from "components/elements/Radio";
import BarWrapper from "components/elements/BarWrapper";
import PercentageBar from "components/elements/PercentageBar";
import ValueBar from "components/elements/ValueBar";

import "./style.sass";

import meta from "resources/meta.json";


class SidebarArea extends React.Component {

  static contextTypes = {
    data: PropTypes.object,
    reach: PropTypes.bool,
    impact: PropTypes.bool,
    region: PropTypes.string,
    country: PropTypes.string,
  };

  render() {

    let { reach, impact, region, country, data } = this.context;

    return (<div id="sidebar">

      {(region || country) && (<div className="breadcrumbs">
        <ul>
          <li><Link to="/reach">World</Link></li>
          {region && (<li>{region}</li>)}
          {country && (<li>{country}</li>)}
        </ul>
      </div>)}

      <div className="content">
        <dl>
          <dt>Projects and Initiatives</dt>
          <dd>{(data.sum_num_projects_and_initiatives || 0).toLocaleString()}</dd>
          <dt>Participants reached</dt>
          <dd>
            <ul>
              <li>
                <div>Direct (?)</div>
                <BarWrapper bar={PercentageBar}
                  value={data.sum_women_total_direct_particip}
                  maxValue={data.sum_total_num_direct_participants} />
              </li>
              <li>
                <div>Indirect (?)</div>
                <BarWrapper bar={PercentageBar}
                  value={data.sum_women_total_indirect_particip}
                  maxValue={data.sum_total_num_indirect_participants} />
              </li>
            </ul>
          </dd>
        </dl>
      </div>

      <div className="filters">
        <h1>Filter by outcome</h1>
        <ul>
          {meta.variables.map((variable, n) => {

            let directValue = data[`sum_num_${variable.id}_direct_particip`];
            let indirectValue = data[`sum_num_${variable.id}_indirect_particip`];
            let maxValue = directValue + indirectValue;

            return (<li key={n}>
              <RadioButton id={`radio-${n}`} name="outcome-filter">{variable.name}</RadioButton>
              <BarWrapper bar={ValueBar}
                value={directValue}
                maxValue={maxValue}
                colorClass={variable.id}
                formatter={(v) => `${v.toLocaleString()} direct`} />
              <BarWrapper bar={ValueBar}
                value={indirectValue}
                maxValue={maxValue}
                colorClass={variable.id}
                formatter={(v) => `${v.toLocaleString()} indirect`} />
            </li>);

          })}
        </ul>
      </div>
    </div>);

  }

}


export default SidebarArea;