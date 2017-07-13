import React from "react";
import PropTypes from "prop-types";
import Layout from "components/Layout";

import getLocation from "lib/location";
import { setKey, getKey } from "lib/storage";
import { fetchReachData, fetchImpactData } from "lib/remote";

class App extends React.PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  }

  static propTypes = {
    mainView: PropTypes.oneOf([
      "notfound",
      "reach",
      "impact",
    ]).isRequired,
    subView: PropTypes.oneOf([
      "countries",
      "regions",
    ]),
    region: PropTypes.string,
    country: PropTypes.string,
    story: PropTypes.string,
    program: PropTypes.string,
  };

  static defaultProps = {
    program: "overall",
  }

  constructor(...args) {
    super(...args);

    this.state = {
      loading: true,
      statistics: {},
      bounds: null,
      modal: !getKey("about-dismissed") ? "about" : null,
    };
  }

  navigate(options) {
    let location = getLocation(options);
    this.context.router.history.push(location);
  }

  handleProgramChange(program) {
    this.navigate({
      mainView: this.props.mainView,
      subView: this.props.subView,
      region: this.state.region,
      country: this.props.mainView === "impact" ?
        this.state.region && this.state.country :
        this.state.country,
      program,
    });
  }

  handleMapChange(region, country) {
    this.navigate({
      mainView: this.props.mainView,
      subView: this.props.subView,
      region: region || this.state.region,
      country: country || this.state.country,
      program: this.state.program,
    });
  }

  handleCloseStory() {
    this.navigate({
      mainView: "impact",
      program: this.state.program,
    });
  }

  handleToggleModal(modal) {
    let previouslyActiveModal = this.state.modal;
    this.setState({
      modal: modal,
    }, () => {
      // persist dismissal of about modal
      if (!this.state.modal && previouslyActiveModal === "about") {
        setKey("about-dismissed", true);
      }
    });
  }

  handleToggleSidebar() {
    console.log("teh toggle lol");
  }

  fetchRemoteData() {
    switch (this.props.mainView) {

      case "reach":
        fetchReachData(this.props.region, this.props.country)
          .then(([statistics, bounds]) => {
            this.setState({
              loading: false,
              statistics: statistics,
              bounds: bounds,
              region: this.props.region,
              country: this.props.country,
              program: this.props.program,
            });
          });
        break;

      case "impact":
        fetchImpactData(this.props.region, this.props.country)
          .then(([statistics, regions, bounds]) => {
            this.setState({
              loading: false,
              statistics: statistics,
              regions: regions,
              bounds: bounds,
              region: this.props.region,
              country: this.props.country,
              story: this.props.story,
              program: this.props.program,
            });
          });
        break;

    }
  }

  componentDidMount() {
    this.fetchRemoteData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.fetchRemoteData();
    }
  }

  render() {
    return (<Layout
      handleProgramChange={this.handleProgramChange.bind(this)}
      handleMapChange={this.handleMapChange.bind(this)}
      handleCloseStory={this.handleCloseStory.bind(this)}
      handleToggleModal={this.handleToggleModal.bind(this)}
      handleToggleSidebar={this.handleToggleSidebar.bind(this)}
      mainView={this.props.mainView}
      subView={this.props.subView}
      {...this.state}
    />);
  }

}

export default App;
