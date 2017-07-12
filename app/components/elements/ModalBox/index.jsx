import React from "react";
import PropTypes from "prop-types";

import AboutContent from "components/elements/ModalBox/content/About";
import ShareContent from "components/elements/ModalBox/content/Share";
import GenericContent from "components/elements/ModalBox/content/Generic";
import "./style.scss";

class ModalBox extends React.Component {

  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    handleClose: PropTypes.func,
  }

  static defaultProps = {
    hidden: true,
    width: 1000,
    height: 600,
  }

  render() {
    let modalStyles = {
      width: `${this.props.width}px`,
      height: `${this.props.height}px`,
    };

    return (<div className="modal-overlay">
      <div className="modal" style={modalStyles}>
        {this.props.handleClose && (<div className="close-button" onClick={this.props.handleClose} />)}
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
