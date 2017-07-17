import React from "react";
import PropTypes from "prop-types";

import Header from "components/areas/Header";
import NotFound from "components/areas/NotFound";
import LeafletWrapper from "components/wrappers/Leaflet";
import Map from "components/areas/Map";
import Sidebar from "components/areas/Sidebar";
import Story from "components/areas/Story";
import Modal from "components/areas/Modal";

class Layout extends React.Component {

  static propTypes = {
    loading: PropTypes.bool,

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
    program: PropTypes.string,
    modal: PropTypes.string,
    story: PropTypes.string,
    bounds: PropTypes.array,

    statistics: PropTypes.object,
    regions: PropTypes.array,

    handleProgramChange: PropTypes.func.isRequired,
    handleToggleModal: PropTypes.func.isRequired,
    handleMapChange: PropTypes.func.isRequired,
    handleCloseStory: PropTypes.func.isRequired,
  }

  static contextTypes = {
    data: PropTypes.shape({
      texts: PropTypes.object.isRequired,
      stories: PropTypes.array.isRequired,
    }).isRequired,
  };

  render() {
    return (<div id="app">
      <Header handleAboutClick={() => this.props.handleToggleModal("about")} />

      {this.props.mainView === "notfound" && (<NotFound />)}

      {this.props.mainView === "reach" && (<div>
        <Sidebar
          loading={this.props.loading}
          mainView={this.props.mainView}
          subView={this.props.subView}
          region={this.props.region}
          country={this.props.country}
          program={this.props.program}
          statistics={this.props.statistics}
          handleProgramChange={this.props.handleProgramChange}
          handleAboutDirectReachClick={() => this.props.handleToggleModal("aboutDirectReach")}
          handleAboutIndirectReachClick={() => this.props.handleToggleModal("aboutIndirectReach")}
        />
        <LeafletWrapper
          bounds={this.props.bounds}
          handleShare={() => this.props.handleToggleModal("share")}
          handleOpenLegend={() => this.props.handleToggleModal("reachLegend")}>
          <Map
            mainView={this.props.mainView}
            subView={this.props.subView}
            country={this.props.country}
            program={this.props.program}
            regions={this.props.regions}
            handleMapChange={this.props.handleMapChange}
            handleAboutClick={() => this.props.handleToggleModal("aboutReach")}
          />
        </LeafletWrapper>
      </div>)}

      {this.props.mainView === "impact" && (<div>
        <Sidebar
          loading={this.props.loading}
          mainView={this.props.mainView}
          region={this.props.region}
          country={this.props.country}
          program={this.props.program}
          statistics={this.props.statistics}
          stories={this.context.data.stories}
          handleProgramChange={this.props.handleProgramChange}
        />
        {this.props.story && (<Story
          handleCloseStory={this.props.handleCloseStory}
          story={this.context.data.stories.find((story) => story.cartodb_id === Number(this.props.story))} />)}
        <LeafletWrapper
          bounds={this.props.bounds}
          handleShare={() => this.props.handleToggleModal("share")}
          handleOpenLegend={() => this.props.handleToggleModal("impactLegend")}>
          <Map
            mainView={this.props.mainView}
            region={this.props.region}
            country={this.props.country}
            program={this.props.program}
            regions={this.props.regions}
            stories={this.context.data.stories}
            handleMapChange={this.props.handleMapChange}
            handleAboutClick={() => this.props.handleToggleModal("aboutImpact")}
          />
        </LeafletWrapper>
      </div>)}

      <Modal
        modal={this.props.modal}
        texts={this.context.data.texts}
        handleClose={() => this.props.handleToggleModal(null)}
        contentProps={{
          subView: this.props.subView,
          program: this.props.program,
        }}
      />

    </div>);
  }
}

export default Layout;
