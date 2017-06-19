import React from "react";

const filters = [
  {
    name: "Humanitarian response",
    values: {
      direct: 11632688,
      indirect: 28718596,
    },
    color: 1,
  },
  {
    name: "World's economic empowerment",
    values: {
      direct: 2695688,
      indirect: 14251779,
    },
    color: 2,
  },
  {
    name: "The right to sexual, reproductive and maternal health",
    values: {
      direct: 50097850,
      indirect: 59515215,
    },
    color: 3,
  },
  {
    name: "Life Free from Violence",
    values: {
      direct: 1628130,
      indirect: 8238240,
    },
    color: 4,
  },
  {
    name: "Food and nutrition security and climate change resilience",
    values: {
      direct: 28662424,
      indirect: 33632878,
    },
    color: 5,
  },
];

class SidebarArea extends React.Component {

  render() {
    return (<div id="sidebar">
      <div className="logo">
        <img alt="care" />
      </div>

      <ul className="menu">
        <li>reach</li>
        <li>world</li>
      </ul>

      <div className="breadcrumbs">
        World
      </div>

      <div className="content">
        <dl>
          <dt>Projects and Initiatives</dt>
          <dd>1044</dd>

          <dt>Participants reached</dt>
          <dd>x
          </dd>
        </dl>
      </div>

      <div className="filters">
        <h1>Filter by outcome</h1>

        <ul>
          {filters.map((filter, n) => (<li key={n}>
            <input id={`filter-outcome-${n}`} type="radio" />
            <label htmlFor={`filter-outcome-${n}`}>{filter.name}</label>
            <span>{filter.values.direct} direct</span>
            <span>{filter.values.indirect} indirect</span>
          </li>))}
        </ul>
      </div>
    </div>);
  }

}

export default SidebarArea;
