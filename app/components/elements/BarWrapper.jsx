import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

class BarWrapper extends React.Component {

  static propTypes = {
    bar: PropTypes.func.isRequired,
    value: PropTypes.number.isRequired,
    maxValue: PropTypes.number.isRequired,
    colorClass: PropTypes.string,
    formatter: PropTypes.func,
  }

  static defaultProps = {
    colorClass: "overall",
    formatter: (value, maxValue) => maxValue.toLocaleString(),
  }

  render() {
    const { bar: Bar, value, maxValue, colorClass, formatter } = this.props;

    if (value) {
      return (<Bar value={value}
        maxValue={maxValue}
        colorClass={colorClass}>
        {formatter(value, maxValue)}
      </Bar>);
    }

    return (<p className={classnames(colorClass, "no-data")}>
      no data
    </p>);
  }

};

export default BarWrapper;
