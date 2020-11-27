module.exports = {
  extends: [require.resolve('eslint-config-ali/react')],
  parser: 'babel-eslint',
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
    REACT_APP_ENV: true,
  },
  rules: {
    'react/prop-types': 0,
    'import/no-named-as-default': 0,
    'import/no-named-as-default-member': 0,
  },
};
