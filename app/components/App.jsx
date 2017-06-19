import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import Layout from "components/Layout";

class App extends React.Component {

  render() {
    return (<Router>
      <Layout>
        <Switch>
          <Redirect from="/" to="/reach" />
          <Route exact path="/reach" />
          <Route exact path="/impact" />
        </Switch>
      </Layout>
    </Router>);
  }
}

export default App;
