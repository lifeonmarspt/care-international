import React from "react";
import PropTypes from "prop-types";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import queryString from "query-string";

import App from "components/App";

const AppWrapper = ({ mainView, subView, match }, { router }) => {
  let qs = queryString.parse(router.route.location.search);

  return (<App
    mainView={mainView}
    subView={subView}
    country={match.params.country && decodeURIComponent(match.params.country)}
    region={match.params.region && decodeURIComponent(match.params.region)}
    program={qs.program}
  />);
};

AppWrapper.contextTypes = {
  router: PropTypes.object.isRequired,
};

class Routes extends React.Component {

  render() {


    return (<Router>
      <Switch>
        <Redirect exact from="/" to="/reach" />
        <Route exact path="/reach" component={(props) => <AppWrapper mainView="reach" {...props} />} />
        <Route exact path="/reach/regions" component={(props) => <AppWrapper mainView="reach" subView="regions" {...props} />} />
        <Route exact path="/reach/:country" component={(props) => <AppWrapper mainView="reach" {...props} />} />
        <Route exact path="/impact" component={(props) => <AppWrapper mainView="impact" {...props} />} />
        <Route exact path="/impact/:region" component={(props) => <AppWrapper mainView="impact" {...props} />} />
        <Route exact path="/impact/:region/:country" component={(props) => <AppWrapper mainView="impact" {...props} />} />
      </Switch>
    </Router>);
  }

}

export default Routes;
