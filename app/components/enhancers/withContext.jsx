import React from "react";
import PropTypes from "prop-types";

const withContext = function(WrappedComponent, context) {

  class ContextProvider extends React.Component {

    constructor(...args) {
      super(...args);
    }

    getChildContext() {
      return context;
    }

    render() {
      return (<WrappedComponent {...this.props} />);
    }
  }

  ContextProvider.childContextTypes = {};
  Object.keys(context).forEach(key => {
    ContextProvider.childContextTypes[key] = PropTypes.any.isRequired;
  });

  return ContextProvider;

};

export default withContext;

/* https://stackoverflow.com/questions/43465480/react-router-link-doesnt-work-with-leafletjs/43594791 */
