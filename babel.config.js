module.exports = (api) => {
  const presets = ['@babel/preset-env'];

  api.cache(true);

  return {
    presets,
  };
};
