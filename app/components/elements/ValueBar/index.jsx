import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import "./style.sass";

class ValueBar extends React.Component {

  static propTypes = {
    colorClass: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    maxValue: PropTypes.number.isRequired,
  };

  render() {
    let styles = {
      current: {
        width: (100 * this.props.value / (this.props.maxValue || 1))  + "%",
      },
    };

    let barClasses = classNames(["valuebar", this.props.colorClass]);

    return (<div className="valuebar__container">
      <span className={barClasses}>
        <span className="valuebar__current" style={styles.current} />
      </span>
      {this.props.children}
    </div>);
  }

}

export default ValueBar;
