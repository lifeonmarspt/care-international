import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import RadioButton from "components/elements/Radio";
import BarWrapper from "components/elements/BarWrapper";
import PercentageBar from "components/elements/PercentageBar";
import ValueBar from "components/elements/ValueBar";

import meta from "resources/meta.json";

import "./style.scss";

class SidebarArea extends React.Component {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    loading: PropTypes.bool.isRequired,
    statistics: PropTypes.object.isRequired,
    buckets: PropTypes.array.isRequired,
    reach: PropTypes.bool,
    impact: PropTypes.bool,
    region: PropTypes.string,
    country: PropTypes.string,
    program: PropTypes.string,
    handleProgramChange: PropTypes.func,
  }

  static defaultProps = {
    program: "overall",
  };

  render() {
    let { loading, reach, impact, region, country, statistics } = this.props;
    let baseHref = (reach && "/reach") || (impact && "/impact");
    if (loading) {
      return (<div id="sidebar" />);
    }

    return (<div id="sidebar">

      {(region || country) && (<div className="breadcrumbs">
        <ul>
          <li><Link to={baseHref}>World</Link></li>
          {region && (<li>{region}</li>)}
          {country && (<li>{country}</li>)}
        </ul>
      </div>)}

      {this.props.program === "overall" && (<div className="content">
        <dl>
          <dt>
            <h1>Projects and Initiatives in 2016</h1>
          </dt>
          <dd>
            <span>{(statistics.projects_and_initiatives || 0).toLocaleString()}</span>
          </dd>
          <dt>
            <h1>Participants reached</h1>
          </dt>
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

      {this.props.program !== "overall" && (<div className="content">
        <dl>
          <dt>
            <h1>Projects and Initiatives in 2016</h1>
            <h2>({meta.programs.find((p) => p.id === this.props.program).label})</h2>
          </dt>
          <dd>{(statistics.projects_and_initiatives || 0).toLocaleString()}</dd>
          <dt>Participants reached in 2016</dt>
          <dd>
            <ul>
              <li>
                <div>Direct (?)</div>
                <BarWrapper bar={ValueBar}
                  colorClass={this.props.program}
                  value={statistics[`${this.props.program}_direct_participants`]}
                  maxValue={statistics["total_direct_participants"]} />
                <BarWrapper bar={ValueBar}
                  value={statistics["total_direct_participants"] - statistics[`${this.props.program}_direct_participants`]}
                  maxValue={statistics["total_direct_participants"]} />
              </li>
              <li>
                <div>Indirect (?)</div>
                <BarWrapper bar={ValueBar}
                  colorClass={this.props.program}
                  value={statistics[`${this.props.program}_indirect_participants`]}
                  maxValue={statistics["total_indirect_participants"]} />
                <BarWrapper bar={ValueBar}
                  value={statistics["total_indirect_participants"] - statistics[`${this.props.program}_indirect_participants`]}
                  maxValue={statistics["total_indirect_participants"]} />
              </li>
            </ul>
          </dd>
        </dl>
      </div>)}

      <div className="filters">
        <h1>Filter by program</h1>
        <ul>
          {meta.programs.map((program, n) => {

            let directValue = statistics[`${program.id}_direct_participants`];
            let indirectValue = statistics[`${program.id}_indirect_participants`];
            let maxValue = directValue + indirectValue;

            return (<li key={n} className={program.id}>
              <RadioButton
                id={`radio-${n}`}
                name="program-filter"
                checked={this.props.program === program.id}
                onChange={() => this.props.handleProgramChange(program.id)}>
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

          {this.props.program !== "overall" && (<li className="see-overall">
            <Link to={baseHref}>
              See overall
            </Link>
          </li>)}
        </ul>
      </div>
    </div>);

  }

}


export default SidebarArea;
