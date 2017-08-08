import React from "react";
import PropTypes from "prop-types";

import "./style.scss";

class NotFoundArea extends React.Component {

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  render() {
    return (<div id="not-found">
      <h1>Page Not Found</h1>
      <p>The page at <em>{this.context.router.route.location.pathname}</em> was not found.</p>
    </div>);
  }
}

export default NotFoundArea;
