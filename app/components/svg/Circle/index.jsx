import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import "../style.scss";

class CircleSVG extends React.Component {

  static propTypes = {
    label: PropTypes.string,
    program: PropTypes.string,
    size: PropTypes.number.isRequired,
    shadow: PropTypes.bool,
  };

  static defaultProps = {
    label: null,
    program: "default",
  }

  render() {
    return (<svg className={classnames(["circle", this.props.program, { shadow: this.props.shadow }])} height={this.props.size} width={this.props.size}>
      <circle cx={this.props.size / 2} cy={this.props.size / 2} r={this.props.size / 2} strokeWidth="1" />
      {this.props.label && (<text x={this.props.size / 2} y={this.props.size / 2} textAnchor="middle" alignmentBaseline="central">
        {this.props.label}
      </text>)}
    </svg>);
  }

}

export default CircleSVG;
