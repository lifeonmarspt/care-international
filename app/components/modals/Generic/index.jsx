import React from "react";
import PropTypes from "prop-types";

import ModalBox from "components/elements/ModalBox";

import "../style.scss";

class GenericModal extends React.Component {

  static propTypes= {
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    text: PropTypes.string,
    hidden: PropTypes.bool,
    handleClose: PropTypes.func.isRequired,
  };

  render() {
    return (<ModalBox hidden={this.props.hidden} handleClose={this.props.handleClose}>
      <div id={this.props.id} className="modal-content">
        <h1>
          {this.props.title}
        </h1>
        <hr />
        <p>
          {this.props.text}
        </p>
      </div>
    </ModalBox>);
  }
}

export default GenericModal;
