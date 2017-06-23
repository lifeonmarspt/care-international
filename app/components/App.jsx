import React from "react";
import PropTypes from "prop-types";
import queryString from "query-string";

import Header from "components/areas/Header";
import Map from "components/areas/Map";
import Sidebar from "components/areas/Sidebar";
import Data from "components/providers/Data";

class App extends React.Component {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    reach: PropTypes.bool,
    impact: PropTypes.bool,
    region: PropTypes.string,
    country: PropTypes.string,
  };

  constructor(...args) {
    super(...args);

    let qs = queryString.parse(this.context.router.route.location.search);

    this.state = {
      outcome: qs.outcome || "overall",
    };
  }

  handleOutcomeChange(outcome) {
    let qs = queryString.stringify({
      outcome: outcome,
    });

    let location = this.context.router.route.location.pathname +
      (qs ? `?${qs}` : "");

    this.setState({
      outcome: outcome,
    }, () => {
      this.context.router.history.push(location);
    });

  }

  render() {
    return (<div id="app">
      <Header />
      <Data {...this.props}
        outcome={this.state.outcome} >
        <Map outcome={this.state.outcome} />
        <Sidebar {...this.props}
          handleOutcomeChange={this.handleOutcomeChange.bind(this)}
          outcome={this.state.outcome} />
      </Data>
    </div>);
  }
}

export default App;
