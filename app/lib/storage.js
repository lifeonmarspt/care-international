const setKey = (key, value) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

const getKey = (key) => {
  return JSON.parse(window.localStorage.getItem(key));
};

export {
  getKey,
  setKey,
};
