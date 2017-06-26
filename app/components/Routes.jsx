import React from "react";
import PropTypes from "prop-types";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import queryString from "query-string";

import App from "components/App";

const AppWrapper = ({ reach, impact, match }, { router }) => {
  let qs = queryString.parse(router.route.location.search);

  return (<App
    reach={reach}
    impact={impact}
    country={match.params.country}
    region={match.params.region}
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
        <Route exact path="/reach" component={(props) => <AppWrapper reach {...props} />} />
        <Route exact path="/reach/:country" component={(props) => <AppWrapper reach {...props} />} />
        <Route exact path="/impact" component={(props) => <AppWrapper impact {...props} />} />
        <Route exact path="/impact/:region" component={(props) => <App impact {...props} />} />
        <Route exact path="/impact/:region/:country" component={(props) => <App impact {...props} />} />
      </Switch>
    </Router>);
  }

}

export default Routes;
