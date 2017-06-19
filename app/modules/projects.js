import fetch from "isomorphic-fetch";

const FETCH_PROJECTS_SUCCESS = "FETCH_PROJECTS_SUCCESS";
const FETCH_PROJECTS_ERROR = "FETCH_PROJECTS_ERROR";
const FETCH_PROJECTS_LOADING = "FETCH_PROJECTS_LOADING";

const initialState = {
  data: {},
  loading: false,
  error: false
};

/* Reducer */
export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_PROJECTS_SUCCESS:
      return Object.assign({}, state, { data: action.payload.data, loading: false, error: false });
    case FETCH_PROJECTS_ERROR:
      return Object.assign({}, state, { error: true, loading: false });
    case FETCH_PROJECTS_LOADING:
      return Object.assign({}, state, { loading: true, error: false });
    default:
      return state;
  }
}

/* Action */
export function fetchProjects() {
  return (dispatch) => {
    // Waiting for fetch from server -> Dispatch loading
    dispatch({ type: FETCH_PROJECTS_LOADING });

    fetch(`${process.env.OTP_API}/projects`, {
      method: "GET"
    })
      .then((response) => {
        if (response.ok) return response.json();
        return dispatch({
          type: FETCH_PROJECTS_ERROR,
          payload: response.statusText
        });
      })
      .then((projects) => {
        // Fetch from server ok -> Dispatch projects
        dispatch({
          type: FETCH_PROJECTS_SUCCESS,
          payload: {
            data: projects
          }
        });
      })
      .catch((err) => {
        // Fetch from server ko -> Dispatch error
        dispatch({
          type: FETCH_PROJECTS_ERROR,
          payload: err.message
        });
      });
  };
}
