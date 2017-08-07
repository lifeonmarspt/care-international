import React from "react";
import PropTypes from "prop-types";

import momImage from "images/mom.png";
import careImage from "images/care2.png";
import careMomImage from "images/caremom.png";

import "./style.scss";

class AboutContent extends React.Component {

  static propTypes= {
    handleClose: PropTypes.func.isRequired,
  };

  render() {
    return (<div id="about">
      <div className="left">
        <img src={momImage} alt="Mom" className="img-mom" />
      </div>
      <div className="right">
        <img src={careImage} alt="CARE" className="img-care" />
        <img src={careMomImage} alt="CARE" className="img-care-mom" />
        <p>
          In 2016, CARE worked in 94 countries around the world to reach more than 80 million people directly through its development and humanitarian aid projects and initiatives. CARE also reached 256 million people indirectly through its advocacy, replication of successful programs and scale up of innovations.
        </p>
        <p>
          In 2016, CARE gathered evidence of impact in 56 countries, contributing to significant improvements for 21 million people.
        </p>
        <button className="primary" onClick={this.props.handleClose}>
          Discover more data
        </button>
      </div>
    </div>);
  }
}

export default AboutContent;
