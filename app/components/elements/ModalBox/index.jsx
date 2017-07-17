import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import AboutContent from "components/elements/ModalBox/content/About";
import ShareContent from "components/elements/ModalBox/content/Share";
import GenericContent from "components/elements/ModalBox/content/Generic";
import "./style.scss";

class ModalBox extends React.Component {

  static propTypes = {
    id: PropTypes.string.isRequired,
    handleClose: PropTypes.func.isRequired,
  }

  render() {
    return (<div className="modal-overlay" onClick={this.props.handleClose}>
      <div className={classnames("modal", `modal-id-${this.props.id}`)} onClick={(e) => e.stopPropagation()}>
        <div className="close-button" onClick={this.props.handleClose} />
        {this.props.children}
      </div>
    </div>);
  }

}

export {
  ModalBox,
  AboutContent,
  GenericContent,
  ShareContent,
};

export default ModalBox;
