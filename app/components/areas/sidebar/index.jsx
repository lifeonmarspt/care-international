import React from "react";
import { NavLink } from "react-router-dom";

import Bar from "components/elements/bar";

import imgCare from "images/care.png";
import "./style.sass";

const filters = [
  {
    name: "Humanitarian response",
    values: {
      direct: 11632688,
      indirect: 28718596,
    },
    colorClass: "humanitarian",
  },
  {
    name: "Women's economic empowerment",
    values: {
      direct: 2695688,
      indirect: 14251779,
    },
    colorClass: "women-econ",
  },
  {
    name: "The right to sexual, reproductive and maternal health",
    values: {
      direct: 50097850,
      indirect: 59515215,
    },
    colorClass: "sex-health",
  },
  {
    name: "Life Free from Violence",
    values: {
      direct: 1628130,
      indirect: 8238240,
    },
    colorClass: "life-violence",
  },
  {
    name: "Food and nutrition security and climate change resilience",
    values: {
      direct: 28662424,
      indirect: 33632878,
    },
    colorClass: "nutrition-security",
  },
];

class SidebarArea extends React.Component {

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
          <dd>1044</dd>
          <dt>Participants reached</dt>
          <dd>
            <ul>
              <li>
                <div>Direct (?)</div>
                <Bar value={30} maxValue={100} label="42% of women">
                  123456789
                </Bar>
              </li>
              <li>
                <div>Indirect (?)</div>
                <Bar value={90} maxValue={100} label="38% of women">
                  123456789
                </Bar>
              </li>
            </ul>
          </dd>
        </dl>
      </div>

      <div className="filters">
        <h1>Filter by outcome</h1>

        <ul>
          {filters.map((filter, n) => (<li key={n}>
            <input id={`filter-outcome-${n}`} type="radio" />
            <label htmlFor={`filter-outcome-${n}`}>{filter.name}</label>
            <Bar value={filter.values.direct}
              maxValue={filter.values.direct*3}
              colorClass={filter.colorClass}>
              {filter.values.direct.toLocaleString()} direct
            </Bar>
            <Bar value={filter.values.indirect}
              maxValue={filter.values.indirect*1.4}
              colorClass={filter.colorClass}>
              {filter.values.indirect.toLocaleString()} indirect
            </Bar>
          </li>))}
        </ul>
      </div>
    </div>);
  }

}

export default SidebarArea;
