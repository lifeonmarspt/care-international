import React from "react";
import PropTypes from "prop-types";

import momImage from "images/mom.png";
import "./style.scss";

class Story extends React.Component {

  static propTypes = {
    story: PropTypes.object.isRequired,
    handleCloseStory: PropTypes.func.isRequired,
  };

  render() {
    return (<div id="story">
      <div className="img-wrapper">
        <img src={momImage} alt="Mom" />
      </div>
      <div className="close-button" onClick={this.props.handleCloseStory} />
      <div className="content">
        <h1>{this.props.story.story}</h1>
        <hr />
      </div>
    </div>);
  }
}

export default Story;
