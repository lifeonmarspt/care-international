import React from "react";
import PropTypes from "prop-types";

import "../style.scss";

class GenericContent extends React.Component {

  static propTypes= {
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  };

  render() {
    return (<div className="modal-content">
      <h1>
        {this.props.title}
      </h1>
      <hr />
      <div className="markup" dangerouslySetInnerHTML={{ __html: this.props.text }} />
    </div>);
  }
}

export default GenericContent;
