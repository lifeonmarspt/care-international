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

  static contextTypes = {
    data: PropTypes.shape({
      stories: PropTypes.array.isRequired,
    }).isRequired,
  };

  render() {
    let {
      story,
      handleCloseStory,
    } = this.props;

    return (<div id="story">
      <div className="show-mobile">
        <ul className="mobile-title">
          <li>
            <div className="story-hide" onClick={handleCloseStory} />
          </li>
          <li>
            {story.story}
          </li>
        </ul>
      </div>
      <div className="img-wrapper">
        <img src={images[story.image] || momImage} alt={story.story} />
      </div>
      <div className="close-button" onClick={handleCloseStory} />
      <div className="story-content">
        <div className="content">
          <h2>{story.outcomes.map((o) => programs.find((p) => p.id === o).label).join("; ")}</h2>
          <ul className="locations">
            {story.countries.map((country) => (<li key={country}>
              {country}
            </li>))}
          </ul>
          <h1 className="show-desktop">{story.story}</h1>
          <hr />
          <div className="markup" dangerouslySetInnerHTML={{ __html: story.content }} />
        </div>
      </div>
    </div>);
  }
}

export default Story;
