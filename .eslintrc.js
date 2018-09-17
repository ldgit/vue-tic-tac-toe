module.exports = {
    'extends': [
      'airbnb-base',
      'plugin:vue/recommended',
    ],
    'rules': {
      'no-use-before-define': ['error', { 'functions': false, 'classes': true }],
      'max-len': ['warn', 120, 2, {
        'ignoreUrls': false,
        'ignoreComments': false,
      }],
    },
    'env': {
        'browser': true,
        'mocha': true,
    }
};
