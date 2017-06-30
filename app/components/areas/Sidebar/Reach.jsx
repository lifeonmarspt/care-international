import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import RadioButton from "components/elements/Radio";
import BarWrapper from "components/elements/BarWrapper";
import PercentageBar from "components/elements/PercentageBar";
import ValueBar from "components/elements/ValueBar";

import getLocation from "lib/location";
import programs from "resources/programs.json";
import imgHelp from "images/help.svg";


import "./style.scss";

class ReachSidebarArea extends React.Component {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    loading: PropTypes.bool.isRequired,
    statistics: PropTypes.object.isRequired,
    region: PropTypes.string,
    country: PropTypes.string,
    program: PropTypes.string,
    handleProgramChange: PropTypes.func,
  }

  static defaultProps = {
    program: "overall",
  };

  render() {
    let {
      loading,
      region,
      country,
      program,
      statistics,
      handleProgramChange,
    } = this.props;

    let linkWorld = getLocation(true, false, undefined, undefined, program);
    let linkOverall = getLocation(true, false, undefined, country, undefined);
    if (loading) {
      return (<div id="sidebar" />);
    }

    return (<div id="sidebar">

      {(region || country) && (<div className="breadcrumbs">
        <ul>
          <li><Link to={linkWorld}>World</Link></li>
          {region && (<li>{region}</li>)}
          {country && (<li>{country}</li>)}
        </ul>
      </div>)}

      {program === "overall" && (<div className="content">
        <dl>
          <dt>
            Projects and Initiatives in 2016
          </dt>
          <dd>
            {(statistics.projects_and_initiatives || 0).toLocaleString()}
          </dd>
        </dl>
      </div>)}

      {program === "overall" && (<div className="content">
        <dl>
          <dt>
            Participants reached in 2016
          </dt>
          <dd>
            <ul>
              <li>
                <div>Direct <img src={imgHelp} alt="Help" /></div>
                <BarWrapper bar={PercentageBar}
                  colorClass="overall"
                  value={statistics["total_direct_participants_women"]}
                  maxValue={statistics["total_direct_participants"]} />
              </li>
              <li>
                <div>Indirect <img src={imgHelp} alt="Help" /></div>
                <BarWrapper bar={PercentageBar}
                  colorClass="overall"
                  value={statistics["total_indirect_participants_women"]}
                  maxValue={statistics["total_indirect_participants"]} />
              </li>
            </ul>
          </dd>
        </dl>
      </div>)}

      {program !== "overall" && (<div className="content">
        <dl>
          <dt>
            Projects and Initiatives in 2016
            <span className="subtitle">({programs.find((p) => p.id === program).label})</span>
          </dt>
          <dd>
            {(statistics.projects_and_initiatives || 0).toLocaleString()}
          </dd>
        </dl>
      </div>)}

      {program !== "overall" && (<div className="content">
        <dl>
          <dt>
            Participants reached in 2016
          </dt>
          <dd>
            <ul>
              <li>
                <div>Direct <img src={imgHelp} alt="Help" /></div>
                <BarWrapper bar={ValueBar}
                  colorClass={program}
                  value={statistics[`${program}_direct_participants`]}
                  maxValue={statistics["total_direct_participants"]} />
                <BarWrapper bar={ValueBar}
                  value={statistics["total_direct_participants"] - statistics[`${program}_direct_participants`]}
                  maxValue={statistics["total_direct_participants"]} />
              </li>
              <li>
                <div>Indirect <img src={imgHelp} alt="Help" /></div>
                <BarWrapper bar={ValueBar}
                  colorClass={program}
                  value={statistics[`${program}_indirect_participants`]}
                  maxValue={statistics["total_indirect_participants"]} />
                <BarWrapper bar={ValueBar}
                  value={statistics["total_indirect_participants"] - statistics[`${program}_indirect_participants`]}
                  maxValue={statistics["total_indirect_participants"]} />
              </li>
            </ul>
          </dd>
        </dl>
      </div>)}

      <div className="filters">
        <dl>
          <dt>
            Participants by program area
          </dt>
          <dd>
            <ul>
              {programs.map((p, n) => {
                let directValue = statistics[`${p.id}_direct_participants`];
                let indirectValue = statistics[`${p.id}_indirect_participants`];
                let maxValue = directValue + indirectValue;

                return (<li key={n} className={p.id}>
                  <RadioButton
                    id={`radio-${n}`}
                    name="program-filter"
                    checked={program === p.id}
                    onChange={() => handleProgramChange(p.id)}>
                    {p.label}
                  </RadioButton>
                  <ul>
                    <li>
                      <BarWrapper bar={ValueBar}
                        value={directValue}
                        maxValue={maxValue}
                        colorClass={p.id}
                        formatter={(v) => `${v.toLocaleString()} direct`}
                      />
                    </li>
                    <li>
                      <BarWrapper bar={ValueBar}
                        value={indirectValue}
                        maxValue={maxValue}
                        colorClass={p.id}
                        formatter={(v) => `${v.toLocaleString()} indirect`}
                      />
                    </li>
                  </ul>
                </li>);
              })}
              {program !== "overall" && (<li className="see-overall">
                <Link to={linkOverall}>
                  See overall
                </Link>
              </li>)}
            </ul>
          </dd>
        </dl>
      </div>
    </div>);

  }

}


export default ReachSidebarArea;
