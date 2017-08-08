import React from "react";

import CircleSVG from "components/svg/Circle";
import RhombusSVG from "components/svg/Rhombus";
import buckets from "resources/buckets.json";

import "./style.scss";
import "../style.scss";

class ImpactLegend extends React.Component {
  render() {
    return (<div id="legend-impact">
      <ul>
        <li>Type of impacts</li>
        <li>
          <ul>
            <li>
              <RhombusSVG size={15} /> Qualitative
            </li>
            <li>
              <CircleSVG size={15} /> Quantitative
            </li>
          </ul>
        </li>
        <li>Population impacted (quantitative)</li>
        <li>
          <ul>
            <li>
              1
            </li>
            {buckets.impact.map((bucket, n) => (<li key={n}>
              <CircleSVG size={bucket[2]/2} />
            </li>))}
            <li>
              1M population impacted
            </li>
          </ul>
        </li>
        <li className="about-button">
          <button className="secondary" onClick={this.props.handleAboutClick}>
            About Data
          </button>
        </li>
      </ul>
    </div>);
  }
}

export default ImpactLegend;
