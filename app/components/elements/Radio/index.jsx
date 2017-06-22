import React from "react";
import PropTypes from "prop-types";

import "./style.sass";

class RadioButton extends React.Component {

  static propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    colorClass: PropTypes.string,
  };

  render() {
    return (<span className="custom-radio">
      <input id={this.props.id}
        name={this.props.name}
        type="radio"
        defaultChecked={this.props.checked}
        onClick={this.props.onClick} />
      <svg width="14" height="14" className={this.props.colorClass}>
        <circle className="outer" cx="7" cy="7" r="6" stroke="black" strokeWidth="1" fill="none" />
        <circle className="inner" cx="7" cy="7" r="3" stroke="black" strokeWidth="1" fill="black" />
      </svg>
      <label htmlFor={this.props.id}>
        {this.props.children}
      </label>
    </span>);
  }
}

export default RadioButton;
