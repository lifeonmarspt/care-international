import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import "./style.sass";

class PercentageBar extends React.Component {

  static propTypes = {
    colorClass: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.number.isRequired,
    maxValue: PropTypes.number.isRequired,
  };

  static defaultProps = {
    colorClass: "overall",
  };

  render() {
    let styles = {
      current: {
        width: (100 * this.props.value / this.props.maxValue)  + "%",
      },
    };

    let barClasses = classNames(["percentagebar", this.props.colorClass]);
    let percentage = Math.round(100 * this.props.value / this.props.maxValue);

    return (<div className="percentagebar__container">
      <span className={barClasses}>
        <span className="percentagebar__current" style={styles.current}>
          <span className="percentagebar__label">
            {percentage}%
          </span>
        </span>
      </span>
      {this.props.children}
    </div>);
  }

}

export default PercentageBar;
