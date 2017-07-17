import React from "react";
import PropTypes from "prop-types";

import AppLink from "components/elements/AppLink";
import buckets from "resources/buckets.json";

import "./style.scss";

class ReachLegend extends React.Component {
  static propTypes = {
    subView: PropTypes.string,
    program: PropTypes.string,
  }

  render() {
    return (<div id="legend-reach">
      <ul>
        {this.props.subView === "countries" && (<li>
          <AppLink mainView="reach" subView="regions" program={this.props.program}>
            Show Regions
          </AppLink>
        </li>)}
        {this.props.subView === "regions" && (<li>
          <AppLink mainView="reach" subView="countries" program={this.props.program}>
            Show Countries
          </AppLink>
        </li>)}
        <li>
          <p>
            Direct participants reached in 2016 by country
          </p>
        </li>
        <li>
          <ul className="scale">
            {buckets.reach.map((bucket, n) => {
              return (<li key={n} className={`program-${this.props.program} bucket-${n + 1}`}>
                <span>{bucket[2]}</span>
              </li>);
            })}
          </ul>
          <ul className="exceptions">
            <li className="no-data">
              <span>No participants recorded or other type of activities</span>
            </li>
            <li className="care-member">
              <span>CARE International Members or Affiliate Members</span>
            </li>
          </ul>
        </li>
      </ul>
    </div>);
  }
}

export default ReachLegend;
