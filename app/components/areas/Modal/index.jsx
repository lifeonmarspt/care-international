import React from "react";
import PropTypes from "prop-types";

import { ModalBox, AboutContent, ShareContent, GenericContent } from "components/elements/ModalBox";
import ReachLegendContent from "components/content/ReachLegend";
import ImpactLegendContent from "components/content/ImpactLegend";

class ModalArea extends React.Component {

  static propTypes = {
    modal: PropTypes.string,
    texts: PropTypes.object.isRequired,
    handleToggleModal: PropTypes.func.isRequired,
    subView: PropTypes.string,
    programs: PropTypes.string,
  };

  render() {

    let modals = [
      {
        id: "about",
        component: AboutContent,
        props: {
          handleClose: () => this.props.handleToggleModal(null),
        },
      },
      {
        id: "share",
        component: ShareContent,
      },
      {
        id: "reachLegend",
        component: ReachLegendContent,
        props: {
          subView: this.props.subView,
          program: this.props.program,
          handleAboutClick: () => this.props.handleToggleModal("aboutReach"),
        },
      },
      {
        id: "impactLegend",
        component: ImpactLegendContent,
        props: {
          handleAboutClick: () => this.props.handleToggleModal("aboutImpact"),
        },
      },
      {
        id: "aboutReach",
        component: GenericContent,
        props: {
          title: "About Reach Data",
          text: this.props.texts.reach_data && this.props.texts.reach_data.message,
        },
      },
      {
        id: "aboutImpact",
        component: GenericContent,
        props: {
          title: "About Impact Data",
          text: this.props.texts.impact_data && this.props.texts.impact_data.message,
        },
      },
      {
        id: "aboutDirectReach",
        component: GenericContent,
        props: {
          title: "About Direct Reach",
          text: this.props.texts.direct && this.props.texts.direct.message,
        },
      },
      {
        id: "aboutIndirectReach",
        component: GenericContent,
        props: {
          title: "About Indirect Reach",
          text: this.props.texts.indirect && this.props.texts.indirect.message,
        },
      },
    ];

    let modalContent = modals.find((modal) => modal.id === this.props.modal) || null;

    return modalContent && (<ModalBox
      id={modalContent.id}
      handleClose={() => this.props.handleToggleModal(null)}
      {...modalContent.props}
    >
      <modalContent.component {...modalContent.props} />
    </ModalBox>);
  }
}

export default ModalArea;
