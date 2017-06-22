import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import queryString from "query-string";

import RadioButton from "components/elements/Radio";
import BarWrapper from "components/elements/BarWrapper";
import PercentageBar from "components/elements/PercentageBar";
import ValueBar from "components/elements/ValueBar";

import meta from "resources/meta.json";

import "./style.sass";

class SidebarArea extends React.Component {

  static contextTypes = {
    router: PropTypes.object,
    data: PropTypes.object,
    reach: PropTypes.bool,
    impact: PropTypes.bool,
    region: PropTypes.string,
    country: PropTypes.string,
  };

  handleFilterChange(variable) {
    let qs = queryString.stringify({
      outcome: variable,
    });
    let location = this.context.router.route.location.pathname +
      (qs ? `?${qs}` : "");
    this.context.router.history.push(location);
  }

  render() {

    let { reach, impact, region, country, data } = this.context;
    let qs = queryString.parse(this.context.router.route.location.search);

    return (<div id="sidebar">

      {(region || country) && (<div className="breadcrumbs">
        <ul>
          <li><Link to={(reach && "/reach") || (impact && "/impact")}>World</Link></li>
          {region && (<li>{region}</li>)}
          {country && (<li>{country}</li>)}
        </ul>
      </div>)}

      {!qs.outcome && (<div className="content">
        <dl>
          <dt>Projects and Initiatives</dt>
          <dd>{(data.num_projects_and_initiatives || 0).toLocaleString()}</dd>
          <dt>Participants reached</dt>
          <dd>
            <ul>
              <li>
                <div>Direct (?)</div>
                <BarWrapper bar={PercentageBar}
                  colorClass="overall"
                  value={data["total_direct_participants_women"]}
                  maxValue={data["total_direct_participants"]} />
              </li>
              <li>
                <div>Indirect (?)</div>
                <BarWrapper bar={PercentageBar}
                  colorClass="overall"
                  value={data["total_indirect_participants_women"]}
                  maxValue={data["total_indirect_participants"]} />
              </li>
            </ul>
          </dd>
        </dl>
      </div>)}

      {qs.outcome && (<div className="content">
        <dl>
          <dt>Projects and Initiatives ({qs.outcome.toUpperCase()})</dt>
          <dd>{(data.num_projects_and_initiatives || 0).toLocaleString()}</dd>
          <dt>Participants reached ({qs.outcome.toUpperCase()})</dt>
          <dd>
            <ul>
              <li>
                <div>Direct (?)</div>
                <BarWrapper bar={ValueBar}
                  colorClass={qs.outcome}
                  value={data[`${qs.outcome}_direct_participants`]}
                  maxValue={data["total_direct_participants"]} />
                <BarWrapper bar={ValueBar}
                  value={data["total_direct_participants"] - data[`${qs.outcome}_direct_participants`]}
                  maxValue={data["total_direct_participants"]} />
              </li>
              <li>
                <div>Indirect (?)</div>
                <BarWrapper bar={ValueBar}
                  colorClass={qs.outcome}
                  value={data[`${qs.outcome}_indirect_participants`]}
                  maxValue={data["total_indirect_participants"]} />
                <BarWrapper bar={ValueBar}
                  value={data["total_indirect_participants"] - data[`${qs.outcome}_indirect_participants`]}
                  maxValue={data["total_indirect_participants"]} />
              </li>
            </ul>
          </dd>
        </dl>
      </div>)}

      <div className="filters">
        <h1>Filter by outcome</h1>
        <ul>
          {meta.reach.filters.map((variable, n) => {

            let directValue = data[`${variable.id}_direct_participants`];
            let indirectValue = data[`${variable.id}_indirect_participants`];
            let maxValue = directValue + indirectValue;

            return (<li key={n}>
              <RadioButton
                id={`radio-${n}`}
                name="outcome-filter"
                checked={qs.outcome === variable.id}
                onChange={this.handleFilterChange.bind(this, variable.id)}>
                {variable.label}
              </RadioButton>
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

          {qs.outcome && (<li>
            <Link to="">
              <button>
                see overall
              </button>
            </Link>
          </li>)}
        </ul>
      </div>
    </div>);

  }

}


export default SidebarArea;
