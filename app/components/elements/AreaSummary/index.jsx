import React from "react";
import PropTypes from "prop-types";

import programs from "resources/programs.json";

class AreaSummary extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.number,
    program: PropTypes.string.isRequired,
  }

  render() {
    let { title, value, program } = this.props;
    return (<div className="content">
      <dl>
        <dt>
          {title}
          {program !== "overall" && (<span className="subtitle">
            {programs.find((p) => p.id === program).label}
          </span>)}
        </dt>
        <dd>
          <span>{(value || "no data").toLocaleString()}</span>
        </dd>
      </dl>
    </div>);
  }
};

export default AreaSummary;
