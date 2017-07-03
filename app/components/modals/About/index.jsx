import React from "react";
import PropTypes from "prop-types";

import ModalBox from "components/elements/ModalBox";
import momImage from "images/mom.png";
import careImage from "images/care2.png";

import "./style.scss";

class AboutModal extends React.Component {

  static propTypes= {
    hidden: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
  };

  render() {
    return (<ModalBox hidden={this.props.hidden}>
      <div id="about">
        <div className="left">
          <img src={momImage} alt="Mom" />
        </div>
        <div className="right">
          <img src={careImage} alt="CARE" />
          <p>
            In 2016, CARE worked in 94 countries around the world to reach more than 80 million people directly through its development and humanitarian aid projects and initiatives. CARE also reached 256 million people indirectly through its advocacy, replication of successful programs and scale up of innovations.
          </p>
          <p>
            In 2016, CARE gathered evidence of impact in 56 countries, contributing to significant improvements for 21 million people.
          </p>
          <button onClick={this.props.onClose}>
            Discover more data
          </button>
        </div>
      </div>
    </ModalBox>);
  }
}

export default AboutModal;
