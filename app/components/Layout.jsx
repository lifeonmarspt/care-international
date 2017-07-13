import React from "react";
import PropTypes from "prop-types";

import Header from "components/areas/Header";
import NotFound from "components/areas/NotFound";
import LeafletWrapper from "components/wrappers/Leaflet";
import ReachMap from "components/areas/Map/Reach";
import ReachSidebar from "components/areas/Sidebar/Reach";
import ImpactMap from "components/areas/Map/Impact";
import ImpactSidebar from "components/areas/Sidebar/Impact";
import Story from "components/areas/Story";
import Modal from "components/areas/Modal";

class Layout extends React.Component {

  static propTypes = {
    loading: PropTypes.bool,

    mainView: PropTypes.string.isRequired,
    subView: PropTypes.string.isRequired,
    region: PropTypes.string,
    country: PropTypes.string,
    program: PropTypes.string,
    modal: PropTypes.string,
    story: PropTypes.string,
    bounds: PropTypes.array,

    statistics: PropTypes.object,
    regions: PropTypes.array,
    stories: PropTypes.array,
    texts: PropTypes.object,

    handleProgramChange: PropTypes.func.isRequired,
    handleToggleModal: PropTypes.func.isRequired,
    handleMapChange: PropTypes.func.isRequired,
    handleCloseStory: PropTypes.func.isRequired,
  }

  render() {
    return (<div id="app">
      <Header />

      {this.props.mainView === "notfound" && (<NotFound />)}

      {this.props.mainView === "reach" && (<div>
        <ReachSidebar
          loading={this.props.loading}
          subView={this.props.subView}
          statistics={this.props.statistics}
          region={this.props.region}
          country={this.props.country}
          program={this.props.program}
          handleProgramChange={this.props.handleProgramChange}
          handleAboutDirectReachClick={() => this.props.handleToggleModal("aboutDirectReach")}
          handleAboutIndirectReachClick={() => this.props.handleToggleModal("aboutIndirectReach")} />
        <LeafletWrapper
          bounds={this.props.bounds}
          handleShare={() => this.props.handleToggleModal("share")}>
          <ReachMap
            subView={this.props.subView}
            country={this.props.country}
            program={this.props.program}
            regions={this.props.regions}
            handleMapChange={this.props.handleMapChange}
            handleAboutClick={() => this.props.handleToggleModal("aboutReach")} />
        </LeafletWrapper>
      </div>)}

      {this.props.mainView === "impact" && (<div>
        <ImpactSidebar
          loading={this.props.loading}
          statistics={this.props.statistics}
          region={this.props.region}
          country={this.props.country}
          program={this.props.program}
          stories={this.props.stories}
          handleProgramChange={this.props.handleProgramChange} />
        {this.props.story && (<Story
          handleCloseStory={this.props.handleCloseStory}
          story={this.props.stories.find((story) => story.cartodb_id === Number(this.props.story))} />)}
        <LeafletWrapper
          bounds={this.props.bounds}
          handleShare={() =>this.props.handleToggleModal("share")}>
          <ImpactMap
            region={this.props.region}
            country={this.props.country}
            program={this.props.program}
            regions={this.props.regions}
            stories={this.props.stories}
            handleMapChange={this.props.handleMapChange}
            handleAboutClick={() => this.props.handleToggleModal("aboutImpact")} />
        </LeafletWrapper>
      </div>)}

      <Modal modal={this.props.modal} texts={this.props.texts} handleClose={() => this.props.handleToggleModal(null)} />

    </div>);
  }
}

export default Layout;
