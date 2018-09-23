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
      "vue/max-attributes-per-line": [4, {
        "singleline": 4,
        "multiline": {
          "max": 4,
          "allowFirstLine": false
        }
      }],
    },
    'env': {
        'browser': true,
        'mocha': true,
    }
};
