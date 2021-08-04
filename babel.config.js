module.exports = {
    presets: ['@babel/typescript', ['@babel/env', {loose: true}], '@babel/react'],
    "plugins": [
        ["@babel/plugin-transform-runtime",
          {
            "regenerator": true
          }
        ]
      ],
};