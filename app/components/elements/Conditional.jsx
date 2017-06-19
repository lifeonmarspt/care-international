import React from "react";
import PropTypes from "prop-types";

class Conditional extends React.Component {

  static propTypes = {
    condition: PropTypes.bool,
  };

  render() {
    if (this.props.condition) {
      return (<span>{this.props.children}</span>);
    }

    return null;
  }
}

export default Conditional;
