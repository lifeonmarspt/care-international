import React from "react";
import PropTypes from "prop-types";

import AppLink from "components/elements/AppLink";
import RadioButton from "components/elements/Radio";
import BarWrapper from "components/wrappers/Bar";
import ValueBar from "components/elements/ValueBar";

import programs from "resources/programs.json";

import "./style.scss";

class ImpactSidebarArea extends React.Component {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    loading: PropTypes.bool.isRequired,
    statistics: PropTypes.object.isRequired,
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
    let {
      loading,
      region,
      country,
      program,
      statistics,
      handleProgramChange,
    } = this.props;

    if (loading) {
      return (<div id="sidebar" />);
    }

    return (<div id="sidebar">

      {(region || country) && (<div className="breadcrumbs">
        <ul>
          <li>
            <AppLink mainView="impact" program={program}>
              World
            </AppLink>
          </li>
          {region && (<li>{region}</li>)}
          {country && (<li>{country}</li>)}
        </ul>
      </div>)}

      {program === "overall" && (<div className="content">
        <dl>
          <dt>
            Total Population impacted in 2016
          </dt>
          <dd>
            <span>{statistics.total_impact.toLocaleString()}</span>
          </dd>
        </dl>
      </div>)}

      {program !== "overall" && (<div className="content">
        <dl>
          <dt>
            Total Population impacted in 2016
            <h2>({programs.find((p) => p.id === program).label})</h2>
          </dt>
          <dd>
            <span>{statistics[`${program}_impact`].toLocaleString()}</span>
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

                let value = statistics[`${p.id}_impact`];
                let maxValue = statistics["total_impact"];

                return (<li key={n} className={p.id}>
                  <RadioButton
                    id={`radio-${n}`}
                    name="program-filter"
                    checked={program === p.id}
                    onChange={() => handleProgramChange(p.id)}>
                    {p.label}
                  </RadioButton>
                  <BarWrapper bar={ValueBar}
                    value={value}
                    maxValue={maxValue}
                    formatter={(v) => v.toLocaleString()}
                    colorClass={p.id} />
                </li>);

              })}

              {program !== "overall" && (<li className="see-overall">
                <AppLink mainView="impact" country={country}>
                  See to all program areas
                </AppLink>
              </li>)}
            </ul>
          </dd>
        </dl>
      </div>

    </div>);

  }

}


export default ImpactSidebarArea;
