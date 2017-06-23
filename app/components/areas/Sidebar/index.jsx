import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import RadioButton from "components/elements/Radio";
import BarWrapper from "components/elements/BarWrapper";
import PercentageBar from "components/elements/PercentageBar";
import ValueBar from "components/elements/ValueBar";

import meta from "resources/meta.json";

import "./style.sass";

class SidebarArea extends React.Component {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    statistics: PropTypes.object.isRequired,
    buckets: PropTypes.array.isRequired,
    reach: PropTypes.bool,
    impact: PropTypes.bool,
    region: PropTypes.string,
    country: PropTypes.string,
    outcome: PropTypes.string,
    handleOutcomeChange: PropTypes.func,
  }

  static defaultProps = {
    outcome: "overall",
  };

  render() {
    let { reach, impact, region, country, statistics } = this.props;
console.log(this.props)
    return (<div id="sidebar">

      {(region || country) && (<div className="breadcrumbs">
        <ul>
          <li><Link to={(reach && "/reach") || (impact && "/impact")}>World</Link></li>
          {region && (<li>{region}</li>)}
          {country && (<li>{country}</li>)}
        </ul>
      </div>)}

      {this.props.outcome === "overall" && (<div className="content">
        <dl>
          <dt>Projects and Initiatives</dt>
          <dd>{(statistics.projects_and_initiatives || 0).toLocaleString()}</dd>
          <dt>Participants reached</dt>
          <dd>
            <ul>
              <li>
                <div>Direct (?)</div>
                <BarWrapper bar={PercentageBar}
                  colorClass="overall"
                  value={statistics["total_direct_participants_women"]}
                  maxValue={statistics["total_direct_participants"]} />
              </li>
              <li>
                <div>Indirect (?)</div>
                <BarWrapper bar={PercentageBar}
                  colorClass="overall"
                  value={statistics["total_indirect_participants_women"]}
                  maxValue={statistics["total_indirect_participants"]} />
              </li>
            </ul>
          </dd>
        </dl>
      </div>)}

      {this.props.outcome !== "overall" && (<div className="content">
        <dl>
          <dt>Projects and Initiatives ({this.props.outcome.toUpperCase()})</dt>
          <dd>{(statistics.projects_and_initiatives || 0).toLocaleString()}</dd>
          <dt>Participants reached ({this.props.outcome.toUpperCase()})</dt>
          <dd>
            <ul>
              <li>
                <div>Direct (?)</div>
                <BarWrapper bar={ValueBar}
                  colorClass={this.props.outcome}
                  value={statistics[`${this.props.outcome}_direct_participants`]}
                  maxValue={statistics["total_direct_participants"]} />
                <BarWrapper bar={ValueBar}
                  value={statistics["total_direct_participants"] - statistics[`${this.props.outcome}_direct_participants`]}
                  maxValue={statistics["total_direct_participants"]} />
              </li>
              <li>
                <div>Indirect (?)</div>
                <BarWrapper bar={ValueBar}
                  colorClass={this.props.outcome}
                  value={statistics[`${this.props.outcome}_indirect_participants`]}
                  maxValue={statistics["total_indirect_participants"]} />
                <BarWrapper bar={ValueBar}
                  value={statistics["total_indirect_participants"] - statistics[`${this.props.outcome}_indirect_participants`]}
                  maxValue={statistics["total_indirect_participants"]} />
              </li>
            </ul>
          </dd>
        </dl>
      </div>)}

      <div className="filters">
        <h1>Filter by outcome</h1>
        <ul>
          {meta.programs.map((program, n) => {

            let directValue = statistics[`${program.id}_direct_participants`];
            let indirectValue = statistics[`${program.id}_indirect_participants`];
            let maxValue = directValue + indirectValue;

            return (<li key={n}>
              <RadioButton
                id={`radio-${n}`}
                name="outcome-filter"
                checked={this.props.outcome === program.id}
                onChange={() => this.props.handleOutcomeChange(program.id)}>
                {program.label}
              </RadioButton>
              <BarWrapper bar={ValueBar}
                value={directValue}
                maxValue={maxValue}
                colorClass={program.id}
                formatter={(v) => `${v.toLocaleString()} direct`} />
              <BarWrapper bar={ValueBar}
                value={indirectValue}
                maxValue={maxValue}
                colorClass={program.id}
                formatter={(v) => `${v.toLocaleString()} indirect`} />
            </li>);

          })}

          {this.props.outcome && (<li>
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
