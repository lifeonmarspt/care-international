import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import "./style.scss";

class PercentageBar extends React.Component {

  static propTypes = {
    colorClass: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    maxValue: PropTypes.number.isRequired,
  };

  render() {
    let percentage = Math.round(100 * this.props.value / (this.props.maxValue || 1)) + "%";
    let styles = {
      current: {
        width: percentage,
      },
    };

    let barClasses = classNames(["percentagebar", this.props.colorClass]);

    return (<div className="percentagebar__container">
      <span className={barClasses}>
        <span className="percentagebar__current" style={styles.current}>
          <span className="percentagebar__label">
            {percentage} women
          </span>
        </span>
      </span>
      {this.props.children}
    </div>);
  }

}

export default PercentageBar;
