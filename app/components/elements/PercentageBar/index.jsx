import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import "./style.scss";

const maxWidth = 97;
const minWidth = 3;

class PercentageBar extends React.Component {

  static propTypes = {
    colorClass: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    maxValue: PropTypes.number.isRequired,
  };

  render() {
    let percentage = Math.round(maxWidth * this.props.value / (this.props.maxValue || 1) + minWidth) + "%";
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
