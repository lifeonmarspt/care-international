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
    story={match.params.story && decodeURIComponent(match.params.story)}
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
        <Redirect exact from="/" to="/reach/countries" />
        <Redirect exact from="/reach" to="/reach/countries" />
        <Route exact path="/reach/countries" component={(props) => <AppWrapper mainView="reach" subView="countries" {...props} />} />
        <Route exact path="/reach/regions" component={(props) => <AppWrapper mainView="reach" subView="regions" {...props} />} />
        <Route exact path="/reach/countries/:country" component={(props) => <AppWrapper mainView="reach" subView="countries" {...props} />} />
        <Route exact path="/reach/regions/:region" component={(props) => <AppWrapper mainView="reach" subView="regions" {...props} />} />
        <Route exact path="/impact" component={(props) => <AppWrapper mainView="impact" {...props} />} />
        <Route exact path="/impact/:region" component={(props) => <AppWrapper mainView="impact" {...props} />} />
        <Route exact path="/impact/:country/story/:story" component={(props) => <AppWrapper mainView="impact" {...props} />} />
        <Route exact path="/impact/:region/:country" component={(props) => <AppWrapper mainView="impact" {...props} />} />
        <Route exact path="*" component={(props) => <AppWrapper mainView="notfound" {...props} />} />
      </Switch>
    </Router>);
  }

}

export default Routes;
