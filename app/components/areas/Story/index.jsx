import React from "react";
import PropTypes from "prop-types";

import images from "images/stories";
import programs from "resources/programs.json";
import momImage from "images/mom.png";
import "./style.scss";

class Story extends React.Component {

  static propTypes = {
    story: PropTypes.object.isRequired,
    handleCloseStory: PropTypes.func.isRequired,
  };

  render() {
    return (<div id="story">
      <div className="show-mobile">
        <ul className="mobile-title">
          <li>
            <div className="story-hide" onClick={this.props.handleCloseStory} />
          </li>
          <li>
            {this.props.story.story}
          </li>
        </ul>
      </div>
      <div className="img-wrapper">
        <img src={images[this.props.story.image] || momImage} alt={this.props.story.story} />
      </div>
      <div className="close-button" onClick={this.props.handleCloseStory} />
      <div className="story-content">
        <div className="content">
          <h1 className="show-desktop">{this.props.story.story}</h1>
          <h2 className="show-mobile">{programs.find((p) => p.id === this.props.story.outcome).label}</h2>
          <h3 className="show-mobile">{this.props.story.country}</h3>
          <hr />
          <div className="markup" dangerouslySetInnerHTML={{ __html: this.props.story.content }} />
        </div>
      </div>
    </div>);
  }
}

export default Story;
