import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import Conditional from "components/elements/Conditional";

import "./style.sass";

class Bar extends React.Component {

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
      container: {
        marginBottom: this.props.label ? "1.5em" : ".5em",
      },
      bar: {
        width: "50%",
      },
      current: {
        width: (100 * this.props.value / this.props.maxValue)  + "%",
      },
    };

    let barClasses = classNames(["bar", this.props.colorClass]);

    return (<div className="bar__container" style={styles.container}>
      <span className={barClasses} style={styles.bar}>
        <span className="bar__current" style={styles.current}>
          <Conditional condition={!!this.props.label}>
            <span className="bar__current__before" style={styles.before} />
            <span className="bar__label">
              {this.props.label}
            </span>
          </Conditional>
        </span>
      </span>
      {this.props.children}
    </div>);
  }

}

export default Bar;
