// next.config.js
// next.config.js
const withTM = require('next-transpile-modules')([
    'antd', 
    '@ant-design/icons', 
    'rc-pagination', 
    'rc-util', 
    'rc-picker', 
    // Add other problematic modules here if needed
  ]);
  module.exports = withTM({
    reactStrictMode: true,
  });
  

