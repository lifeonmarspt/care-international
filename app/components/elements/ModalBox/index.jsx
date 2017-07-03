import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import "./style.scss";

class ModalBox extends React.Component {

  static propTypes = {
    hidden: PropTypes.bool,
    width: PropTypes.number,
    height: PropTypes.number,
  }

  static defaultProps = {
    hidden: true,
    width: 1000,
    height: 600,
  }

  render() {
    let overlayClasses = classnames(["modal-overlay", {
      hidden: this.props.hidden,
    }]);

    let modalStyles = {
      width: `${this.props.width}px`,
      height: `${this.props.height}px`,
      left: `calc(50% - ${this.props.width/2}px`,
      top: `calc(50% - ${this.props.height/2}px`,
    };

    return (<div className={overlayClasses}>
      <div className="modal" style={modalStyles}>
        {this.props.children}
      </div>
      <div className="close-button" />
    </div>);
  }

}

export default ModalBox;
