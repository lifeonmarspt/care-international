import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import "../style.scss";

class RhombusSVG extends React.Component {

  static propTypes = {
    program: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
  };

  render() {
    let rectSideLen = Math.floor(this.props.size / Math.SQRT2);
    return (<svg className={classnames(["rhombus", this.props.program])} height={this.props.size} width={this.props.size}>
      <rect width={rectSideLen} height={rectSideLen} strokeWidth="1" transform={`translate(${this.props.size / 2} 0) rotate(45)`} />
    </svg>);
  }

}

export default RhombusSVG;
