import React from "react";
import PropTypes from "prop-types";

import "./style.sass";

class RadioButton extends React.Component {

  static propTypes = {
    id: PropTypes.string.isRequired,
  };

  render() {
    return (<span className="custom-radio">
      <input id={this.props.id} name={this.props.name} type="radio" />
      <div className="fake-radio" />
      <label htmlFor={this.props.id}>
        {this.props.children}
      </label>
    </span>);
  }
}

export default RadioButton;
