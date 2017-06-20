import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import App from "components/App";

class Routes extends React.Component {

  render() {
    return (<Router>
      <Switch>
        <Redirect exact from="/" to="/reach" />
        <Route exact path="/reach" component={() => <App reach />} />
        <Route exact path="/reach/:region" component={({ match }) => <App reach region={match.params.region} />} />
        <Route exact path="/reach/:region/:country" component={({ match }) => <App reach region={match.params.region} country={match.params.country} />} />
        <Route exact path="/impact" component={() => <App impact />} />
        <Route exact path="/impact/:region" component={({ match }) => <App impact region={match.params.region} />} />
        <Route exact path="/impact/:region/:country" component={({ match }) => <App impact region={match.params.region} country={match.params.country} />} />
      </Switch>
    </Router>);
  }

}

export default Routes;
