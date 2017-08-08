import storage from "local-storage-fallback";

const setKey = (key, value) => {
  storage.setItem(key, JSON.stringify(value));
};

const getKey = (key) => {
  return JSON.parse(storage.getItem(key));
};

export {
  getKey,
  setKey,
};
