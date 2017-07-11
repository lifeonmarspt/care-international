import React from "react";
import PropTypes from "prop-types";

import Header from "components/areas/Header";
import LeafletWrapper from "components/wrappers/Leaflet";
import ReachMap from "components/areas/Map/Reach";
import ReachSidebar from "components/areas/Sidebar/Reach";
import ImpactMap from "components/areas/Map/Impact";
import ImpactSidebar from "components/areas/Sidebar/Impact";
import Story from "components/areas/Story";
import { ModalBox, AboutContent, ShareContent, GenericContent } from "components/elements/ModalBox";
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
      texts: [],
      mainView: null,
      subView: null,
      modal: !getKey("about-dismissed") ? "about" : null,
    };
  }

  navigate(options) {
    let location = getLocation(options);
    this.context.router.history.push(location);
  }

  handleProgramChange(program) {
    this.navigate({
      mainView: this.state.mainView,
      subView: this.state.subView,
      region: this.state.region,
      country: this.state.mainView === "impact" ?
        this.state.region && this.state.country :
        this.state.country,
      program,
    });
  }

  handleMapChange(region, country) {
    this.navigate({
      mainView: this.state.mainView,
      subView: this.state.subView,
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

  fetchRemoteData() {
    switch (this.props.mainView) {

      case "reach":
        fetchReachData(this.props.region, this.props.country)
          .then(([texts, statistics, bounds]) => {
            this.setState({
              loading: false,
              texts: texts,
              statistics: statistics.rows[0],
              bounds: bounds,
              mainView: this.props.mainView,
              subView: this.props.subView,
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
          subView={this.state.subView}
          statistics={this.state.statistics}
          region={this.state.region}
          country={this.state.country}
          program={this.state.program}
          handleProgramChange={this.handleProgramChange.bind(this)}
          handleAboutDirectReachClick={this.handleToggleModal.bind(this, "aboutDirectReach")}
          handleAboutIndirectReachClick={this.handleToggleModal.bind(this, "aboutIndirectReach")} />
        <LeafletWrapper
          bounds={this.state.bounds}
          handleShare={this.handleToggleModal.bind(this, "share")}>
          <ReachMap
            subView={this.state.subView}
            country={this.state.country}
            program={this.state.program}
            regions={this.state.regions}
            handleMapChange={this.handleMapChange.bind(this)}
            handleAboutClick={this.handleToggleModal.bind(this, "aboutReach")} />
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
          handleShare={this.handleToggleModal.bind(this, "share")}>
          <ImpactMap
            region={this.state.region}
            country={this.state.country}
            program={this.state.program}
            regions={this.state.regions}
            stories={this.state.stories}
            handleMapChange={this.handleMapChange.bind(this)}
            handleAboutClick={this.handleToggleModal.bind(this, "aboutImpact")} />
        </LeafletWrapper>
      </div>)}

      {this.state.modal && (<ModalBox handleClose={this.handleToggleModal.bind(this, null)}>

        {this.state.modal === "about" && (<AboutContent
          handleClose={this.handleToggleModal.bind(this, null)} />)}

        {this.state.modal === "share" && (<ShareContent />)}

        {this.state.modal === "aboutReach" && (<GenericContent
          title="About Reach Data"
          text={this.state.texts.reach_data && this.state.texts.reach_data.message} />)}

        {this.state.modal === "aboutImpact" && (<GenericContent
          title="About Impact Data"
          text={this.state.texts.impact_data && this.state.texts.impact_data.message} />)}

        {this.state.modal === "aboutDirectReach" && (<GenericContent
          title="About Direct Reach"
          text={this.state.texts.direct && this.state.texts.direct.message} />)}

        {this.state.modal === "aboutIndirectReach" && (<GenericContent
          title="About Indirect Reach"
          text={this.state.texts.indirect && this.state.texts.indirect.message} />)}

      </ModalBox>)}
    </div>);
  }
}

export default App;
