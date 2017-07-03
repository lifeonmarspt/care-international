import React from "react";
import PropTypes from "prop-types";
import copy from "copy-to-clipboard";

import ModalBox from "components/elements/ModalBox";

import "./style.scss";
import "../style.scss";

class ShareModal extends React.Component {

  static propTypes= {
    hidden: PropTypes.bool,
    handleClose: PropTypes.func.isRequired,
  };

  constructor(...args) {
    super(...args);
    this.url = window.location;
  }

  copyTextArea() {
    copy(this.url);
  }

  render() {
    return (<ModalBox hidden={this.props.hidden} handleClose={this.props.handleClose}>
      <div id="share" className="modal-content">
        <h1>
          Share Content
        </h1>
        <hr />
        <p>
          Copy the link below to share it
        </p>
        <div className="container">
          <textarea value={this.url} readOnly />
          <button className="primary" onClick={this.copyTextArea.bind(this)}>
            share
          </button>
        </div>
      </div>
    </ModalBox>);
  }
}

export default ShareModal;
