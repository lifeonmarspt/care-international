import React from "react";
import PropTypes from "prop-types";

import Header from "components/areas/Header";
import NotFound from "components/areas/NotFound";
import LeafletWrapper from "components/wrappers/Leaflet";
import Map from "components/areas/Map";
import Sidebar from "components/areas/Sidebar";
import Story from "components/areas/Story";
import Modal from "components/areas/Modal";

import navigationProps from "props/navigation";

class Layout extends React.Component {

  static propTypes = {
    loading: PropTypes.bool,

    navigation: navigationProps.isRequired,

    modal: PropTypes.string,

    data: PropTypes.shape({
      statistics: PropTypes.object,
      regions: PropTypes.array,
      bounds: PropTypes.array,
    }).isRequired,

    handlers: PropTypes.shape({
      handleProgramChange: PropTypes.func.isRequired,
      handleToggleModal: PropTypes.func.isRequired,
      handleMapChange: PropTypes.func.isRequired,
      handleCloseStory: PropTypes.func.isRequired,
    }).isRequired,
  }

  static contextTypes = {
    data: PropTypes.shape({
      texts: PropTypes.object.isRequired,
      stories: PropTypes.array.isRequired,
    }).isRequired,
  };

  renderReach() {
    let {
      loading,
      navigation,
    } = this.props;

    let {
      statistics,
      regions,
      bounds,
    } = this.props.data;

    let {
      stories,
    } = this.context.data;

    let {
      handleProgramChange,
      handleMapChange,
      handleToggleModal,
    } = this.props.handlers;

    return (<div>
      <Sidebar
        loading={loading}
        navigation={navigation}
        data={{
          statistics,
          stories,
        }}
        handlers={{
          handleProgramChange,
          handleAboutDirectReachClick: () => handleToggleModal("aboutDirectReach"),
          handleAboutIndirectReachClick: () => handleToggleModal("aboutIndirectReach"),
        }}
      />
      <LeafletWrapper
        bounds={bounds}
        handlers={{
          handleShare: () => handleToggleModal("share"),
          handleOpenLegend: () => handleToggleModal("reachLegend"),
        }}
      >
        <Map
          navigation={navigation}
          data={{
            regions,
          }}
          handlers={{
            handleMapChange,
            handleAboutClick: () => handleToggleModal("aboutReach"),
          }}
        />
      </LeafletWrapper>
    </div>);
  }

  renderImpact(story) {
    let {
      loading,
      navigation,
      handlers,
    } = this.props;

    let {
      statistics,
      regions,
      bounds,
    } = this.props.data;

    let {
      stories,
    } = this.context.data;


    let {
      handleProgramChange,
      handleMapChange,
      handleToggleModal,
    } = this.props.handlers;

    // use bounds from story data if impact section is displaying a story
    if (story) {
      bounds = [[story.ymin, story.xmin], [story.ymax, story.xmax]];
    }

    return (<div>
      <Sidebar
        loading={loading}
        navigation={navigation}
        data={{
          statistics,
          stories,
        }}
        handlers={{
          handleProgramChange,
        }}
      />

      {story && (<Story
        handleCloseStory={handlers.handleCloseStory}
        story={story} />)}

      <LeafletWrapper
        bounds={bounds}
        handlers={{
          handleShare: () => handleToggleModal("share"),
          handleOpenLegend: () => handleToggleModal("impactLegend"),
        }}
      >
        <Map
          navigation={navigation}
          data={{
            regions,
            stories,
          }}
          handlers={{
            handleMapChange,
            handleAboutClick: () => handlers.handleToggleModal("aboutImpact"),
          }}
        />
      </LeafletWrapper>
    </div>);
  }

  renderNotFound() {
    return (<NotFound />);
  }

  render() {
    let { modal, navigation, handlers } = this.props;

    let { mainView } = navigation;

    /* prevent the possibility that a story is rendered with a wrong country in the background */
    let story = navigation.story && this.context.data.stories
      .filter((story) => story.story_number === Number(navigation.story))
      .find(s => s);

    if (navigation.story && !story) {
      mainView = "notfound";
    }

    return (<div id="app">
      <Header
        handleAboutClick={() => handlers.handleToggleModal("about")}
      />

      {mainView === "notfound" && this.renderNotFound()}

      {mainView === "reach" && this.renderReach()}

      {mainView === "impact" && this.renderImpact(story)}

      <Modal
        modal={modal}
        texts={this.context.data.texts}
        handleClose={() => handlers.handleToggleModal(null)}
        handleToggleModal={handlers.handleToggleModal}
        subView={navigation.subView}
        program={navigation.program}
      />
    </div>);
  }
}

export default Layout;
