import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import getLocation from "lib/location";

class AppLink extends React.Component {

  static propTypes = {
    mainView: PropTypes.oneOf([
      "reach",
      "impact",
    ]),
    subView: PropTypes.oneOf([
      "countries",
      "regions",
    ]),
    program: PropTypes.string,
    country: PropTypes.string,
    region: PropTypes.string,
  }

  render() {
    let link = getLocation(this.props);
    return (<Link to={link}>
      {this.props.children}
    </Link>);
  }

}

export default AppLink;
