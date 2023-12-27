let lastUpdate : Date;

export const setLastUpdate = () => {
    lastUpdate = new Date();
};

export const getLastUpdate = () => {
  return lastUpdate;
};