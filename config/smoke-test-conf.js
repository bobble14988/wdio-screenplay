const merge = require('deepmerge');
const baseConf = require('./base-conf');

exports.config = merge(baseConf.config, {
  specs: [ './runners/smoke-test.js' ],
});
