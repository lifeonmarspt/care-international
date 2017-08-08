import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import withContext from "components/enhancers/withContext";
import getLocation from "lib/location";

class StorySummary extends React.Component {

  static propTypes = {
    story: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
  }

  render() {
    const LinkWithContext = withContext(Link, { router: this.props.router });

    let location = getLocation({
      mainView: "impact",
      country: this.props.story.country,
      story: this.props.story.story_number,
    });

    return (<div>
      {this.props.story.story}
      <hr />
      <LinkWithContext to={location}>See all story</LinkWithContext>
    </div>);
  }

}

export default StorySummary;
