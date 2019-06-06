const cmd = require('node-cmd');

exports.config = {
  maxInstances: 1,

  capabilities: [{
    browserName: 'chrome'
  }],
  
  plugins: {
    'wdio-screenshot': {}
  },

  implicitWaitDuration: 5000,

  sync: true,

  logLevel: 'silent',

  coloredLogs: true,

  deprecationWarnings: true,

  bail: 0,

  screenshotPath: './reporting/error-screenshots/',

  connectionRetryTimeout: 90000,

  connectionRetryCount: 3,

  framework: 'jasmine',

  reporters: ['dot', 'allure-fnb', 'junit'],

  reporterOptions: {
    outputDir: './reporting/junit',
  },

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000000,
  },

  onPrepare(config, capabilities) {
    cmd.run('rm -R reporting/');
  },
  
  beforeSession(config, capabilities, specs) {
    require('babel-register');

    global.executionContext = {};

    var args = require('minimist')(process.argv.slice(2));
    global.environment = args['env'];
    global.debug = args['debug'];
    global.only = args['only'];
    global.validateFields = args['fv'];
    global.takeScreenshots = args['ss'];
    
    var browserReset = args['reset'];

    console.log(`Environment is set to ${global.environment}`);
    if (global.debug) console.log(`Debug function is on; test will pause upon failure`);
    if (global.only) console.log(`Only function is set to ${global.only}; only the test with that ID will run`);
    if (global.validateFields) console.log(`ValidateFields function is on; any field rules will be checked during the test`);
    if (global.takeScreenshots) console.log(`TakeScreenshots function is on; framework will take screenshots where instructed`);
    if (browserReset) cmd.run('pkill Chrome');
  },

  before(capabilities, specs) {
    browser.timeouts('implicit', this.implicitWaitDuration);
  },

  afterSession(config, capabilities, specs) {
    cmd.run('./node_modules/allure-commandline/bin/allure generate ./reporting/allure-results/ -c ' +
      '-o ./reporting/allure-report/');
  },

  onError(message) {
    let d = new Date();
    browser.saveDocumentScreenshot(`${this.screenshotPath}/full-screen/ss_${d.getTime()}.png`);
  }
};