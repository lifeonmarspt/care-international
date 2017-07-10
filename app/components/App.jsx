import React from "react";
import PropTypes from "prop-types";

import Header from "components/areas/Header";
import LeafletWrapper from "components/wrappers/Leaflet";
import ReachMap from "components/areas/Map/Reach";
import ReachSidebar from "components/areas/Sidebar/Reach";
import ImpactMap from "components/areas/Map/Impact";
import ImpactSidebar from "components/areas/Sidebar/Impact";
import Story from "components/areas/Story";
import AboutModal from "components/modals/About";
import ShareModal from "components/modals/Share";
import GenericModal from "components/modals/Generic";

import getLocation from "lib/location";
import { setKey, getKey } from "lib/storage";
import { fetchReachData, fetchImpactData } from "lib/remote";

class App extends React.PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  }

  static propTypes = {
    mainView: PropTypes.oneOf([
      "reach",
      "impact",
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
      texts: [],
      mainView: null,
      showAboutModal: !getKey("about-dismissed"),
      showShareModal: false,
      showReachModal: false,
      showImpactModal: false,
      showDirectReachModal: false,
      showIndirectReachModal: false,
    };
  }

  navigate(options) {
    let location = getLocation(options);
    this.context.router.history.push(location);
  }

  handleProgramChange(program) {
    this.navigate({
      mainView: this.state.mainView,
      region: this.state.region,
      country: this.state.mainView === "impact" ?
        this.state.region && this.state.country :
        this.state.country,
      program,
    });
  }

  handleCountryChange(country) {
    this.navigate({
      mainView: this.state.mainView,
      region: this.state.region,
      country,
      program: this.state.program,
    });
  }

  handleRegionChange(region) {
    this.navigate({
      mainView: this.state.mainView,
      region,
      country: this.state.country,
      program: this.state.program,
    });
  }

  handleCloseStory() {
    this.navigate({
      mainView: "impact",
      program: this.state.program,
    });
  }

  handleCloseAbout() {
    this.setState({
      showAboutModal: false,
    }, () => {
      setKey("about-dismissed", true);
    });
  }

  handleToggleModal(stateVar) {
    this.setState({
      [stateVar]: !this.state[stateVar],
    });
  }

  fetchRemoteData() {
    switch (this.props.mainView) {

      case "reach":
        fetchReachData(this.props.country, this.props.program)
          .then(([texts, statistics, bounds]) => {
            this.setState({
              loading: false,
              texts: texts,
              statistics: statistics.rows[0],
              bounds: bounds,
              mainView: this.props.mainView,
              region: this.props.region,
              country: this.props.country,
              program: this.props.program,
            });
          });
        break;

      case "impact":
        fetchImpactData(this.props.region, this.props.country)
          .then(([texts, statistics, regions, stories, bounds]) => {
            this.setState({
              loading: false,
              texts: texts,
              statistics: statistics.rows[0],
              regions: regions.rows,
              stories: stories.rows,
              bounds: bounds,
              mainView: this.props.mainView,
              region: this.props.region,
              country: this.props.country,
              story: this.props.story,
              program: this.props.program,
            });
          });
        break;

      default:
        // eslint-disable-next-line
        console.error("wat");
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
    return (<div id="app">
      <Header />

      {this.props.mainView === "reach" && (<div>
        <ReachSidebar
          loading={this.state.loading}
          statistics={this.state.statistics}
          region={this.state.region}
          country={this.state.country}
          program={this.state.program}
          handleProgramChange={this.handleProgramChange.bind(this)}
          handleAboutDirectReachClick={this.handleToggleModal.bind(this, "showDirectReachModal")}
          handleAboutIndirectReachClick={this.handleToggleModal.bind(this, "showIndirectReachModal")}
          handleAboutClick={this.handleToggleModal.bind(this, "showReachModal")} />
        <LeafletWrapper
          bounds={this.state.bounds}
          handleShare={this.handleToggleModal.bind(this, "showShareModal")}>
          <ReachMap
            country={this.state.country}
            program={this.state.program}
            regions={this.state.regions}
            handleCountryChange={this.handleCountryChange.bind(this)}
            handleRegionChange={this.handleRegionChange.bind(this)}
            handleAboutClick={this.handleToggleModal.bind(this, "showReachModal")} />
        </LeafletWrapper>
      </div>)}

      {this.props.mainView === "impact" && (<div>
        <ImpactSidebar
          loading={this.state.loading}
          statistics={this.state.statistics}
          region={this.state.region}
          country={this.state.country}
          program={this.state.program}
          stories={this.state.stories}
          handleProgramChange={this.handleProgramChange.bind(this)} />
        {this.state.story && (<Story
          handleCloseStory={this.handleCloseStory.bind(this)}
          story={this.state.stories.find((story) => story.cartodb_id === Number(this.state.story))} />)}
        <LeafletWrapper
          bounds={this.state.bounds}
          handleShare={this.handleToggleModal.bind(this, "showShareModal")}>
          <ImpactMap
            region={this.state.region}
            country={this.state.country}
            program={this.state.program}
            regions={this.state.regions}
            stories={this.state.stories}
            handleCountryChange={this.handleCountryChange.bind(this)}
            handleRegionChange={this.handleRegionChange.bind(this)}
            handleAboutClick={this.handleToggleModal.bind(this, "showImpactModal")} />
        </LeafletWrapper>
      </div>)}

      <AboutModal
        hidden={!this.state.showAboutModal}
        handleClose={this.handleCloseAbout.bind(this)} />

      <ShareModal
        hidden={!this.state.showShareModal}
        handleClose={this.handleToggleModal.bind(this, "showShareModal")} />

      <GenericModal
        id="about-reach-modal"
        title="About Reach Data"
        text={this.state.texts.reach_data && this.state.texts.reach_data.message}
        hidden={!this.state.showReachModal}
        handleClose={this.handleToggleModal.bind(this, "showReachModal")} />

      <GenericModal
        id="about-impact-modal"
        title="About Impact Data"
        text={this.state.texts.impact_data && this.state.texts.impact_data.message}
        hidden={!this.state.showImpactModal}
        handleClose={this.handleToggleModal.bind(this, "showImpactModal")} />

      <GenericModal
        id="about-direct-reach"
        title="About Direct Reach"
        text={this.state.texts.direct && this.state.texts.direct.message}
        hidden={!this.state.showDirectReachModal}
        handleClose={this.handleToggleModal.bind(this, "showDirectReachModal")} />

      <GenericModal
        id="about-indirect-reach"
        title="About Indirect Reach"
        text={this.state.texts.indirect && this.state.texts.indirect.message}
        hidden={!this.state.showIndirectReachModal}
        handleClose={this.handleToggleModal.bind(this, "showIndirectReachModal")} />

    </div>);
  }
}

export default App;
