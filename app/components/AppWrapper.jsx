import React from "react";
import PropTypes from "prop-types";
import queryString from "query-string";

import App from "components/App";

class AppWrapper extends React.Component {

  static contextTypes =  {
    router: PropTypes.object.isRequired,
  };

  render() {
    let { mainView, subView, match } = this.props;
    let { router } = this.context;

    let qs = queryString.parse(router.route.location.search);

    return (<App
      mainView={mainView}
      subView={subView}
      country={match.params.country && decodeURIComponent(match.params.country)}
      region={match.params.region && decodeURIComponent(match.params.region)}
      story={match.params.story && decodeURIComponent(match.params.story)}
      program={qs.program}
    />);
  }

};

export default AppWrapper;
