import React from "react";
import PropTypes from "prop-types";

import { ModalBox, AboutContent, ShareContent, GenericContent } from "components/elements/ModalBox";

class ModalArea extends React.Component {

  static propTypes = {
    modal: PropTypes.string,
    texts: PropTypes.object.isRequired,
    handleClose: PropTypes.func.isRequired,
  };

  render() {

    let modals = [
      {
        id: "about",
        component: AboutContent,
        props: {
          handleClose: this.props.handleClose,
        },
      },
      {
        id: "share",
        component: ShareContent,
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

    return modalContent && (<ModalBox id={modalContent.id} {...modalContent.props} handleClose={this.props.handleClose}>
      <modalContent.component {...modalContent.props} />
    </ModalBox>);
  }
}

export default ModalArea;
