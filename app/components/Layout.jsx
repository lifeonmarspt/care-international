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

  renderImpact() {
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
      {navigation.story && (<Story
        handleCloseStory={handlers.handleCloseStory}
        story={this.context.data.stories.find((story) => story.cartodb_id === Number(navigation.story))} />)}
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

    return (<div id="app">
      <Header
        handleAboutClick={() => handlers.handleToggleModal("about")}
      />

      {navigation.mainView === "notfound" && this.renderNotFound()}

      {navigation.mainView === "reach" && this.renderReach()}

      {navigation.mainView === "impact" && this.renderImpact()}

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
