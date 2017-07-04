import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import "../style.scss";

class CircleSVG extends React.Component {

  static propTypes = {
    label: PropTypes.string.isRequired,
    program: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
  };

  render() {
    return (<svg className={classnames(["circle", this.props.program])} height={this.props.size} width={this.props.size}>
      <circle cx={this.props.size / 2} cy={this.props.size / 2} r={this.props.size / 2} strokeWidth="1" />
      <text x={this.props.size / 2} y={this.props.size / 2} textAnchor="middle" alignmentBaseline="central">
        {this.props.label}
      </text>
    </svg>);
  }

}

export default CircleSVG;
