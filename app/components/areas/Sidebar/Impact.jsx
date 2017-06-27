import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import RadioButton from "components/elements/Radio";
import BarWrapper from "components/elements/BarWrapper";
import ValueBar from "components/elements/ValueBar";

import getLocation from "lib/location";
import meta from "resources/meta.json";

import "./style.scss";

class ImpactSidebarArea extends React.Component {

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
    let {
      loading,
      region,
      country,
      program,
      statistics,
      handleProgramChange,
    } = this.props;

    let linkWorld = getLocation(false, true, undefined, program);
    let linkOverall = getLocation(false, true, country, undefined);
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
            <h1>Total Population impacted in 2016</h1>
          </dt>
          <dd>
            <span>{statistics.total_impact.toLocaleString()}</span>
          </dd>
        </dl>
      </div>)}

      {program !== "overall" && (<div className="content">
        <dl>
          <dt>
            <h1>Total Population impacted in 2016</h1>
            <h2>({meta.programs.find((p) => p.id === program).label})</h2>
          </dt>
          <dd>
            <span>{statistics[`${program}_impact`].toLocaleString()}</span>
          </dd>
        </dl>
      </div>)}

      <div className="filters">
        <h1>Participants by program area</h1>
        <ul>
          {meta.programs.map((p, n) => {

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
            <Link to={linkOverall}>
              See overall
            </Link>
          </li>)}
        </ul>
      </div>

    </div>);

  }

}


export default ImpactSidebarArea;