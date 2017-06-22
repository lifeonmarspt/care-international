import React from "react";
import PropTypes from "prop-types";

import "./style.sass";

class RadioButton extends React.Component {

  static propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
  };

  render() {
    return (<span className="custom-radio">
      <input id={this.props.id}
        name={this.props.name}
        type="radio"
        checked={this.props.checked}
        onClick={this.props.onClick} />
      <div className="fake-radio" />
      <label htmlFor={this.props.id}>
        {this.props.children}
      </label>
    </span>);
  }
}

export default RadioButton;
