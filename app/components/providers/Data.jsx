import React from "react";
import PropTypes from "prop-types";

import { fetchGlobalData } from "lib/remote";

class DataProvider extends React.Component {

  static childContextTypes = {
    data: PropTypes.shape({
      texts: PropTypes.object.isRequired,
      stories: PropTypes.array.isRequired,
    }).isRequired,
  };

  constructor(...args) {
    super(...args);
    this.state = {
      loading: true,
      data: {
        texts: {},
        stories: [],
      },
    };
  }

  getChildContext() {
    return {
      data: this.state.data,
    };
  }

  componentWillMount() {
    fetchGlobalData()
      .then(([texts, stories, storiesByCountry]) => {
        this.setState({
          data: {
            texts,
            stories,
            storiesByCountry,
          },
          loading: false,
        });
      });
  }

  render() {
    return !this.state.loading && this.props.children;
  }

}

export default DataProvider;
