// Import library functions
import using from 'jasmine-data-provider';
import Validator from 'jsonschema/lib/validator';
import { fail } from 'assert';

// Import test
import Tester from '../framework/tester';

// Import schema and test data
import schema from '../schemas/test-schema';
import testFile from '../tests/smoke-test';
import { suite } from '../tests/smoke-test';

describe(suite.name, function () {
  using(suite.tests, function (testData) {
    it(`${testData.id}: ${testData.description}`, function () {
      try {
        // Validate JSON - TODO: Move this step to beforeSuite() and do every test data file at once
        var results = new Validator().validate(testFile, schema);

        if (results.errors.length > 0) {
          console.log(`### Schema Errors ###\n${results.errors.toString().replace(/,/g, ",\n")}\n#####################`);
          fail('Invalid test data provided. See schema validation errors for more information.');
        }

        // Create test context
        var testContext = {};

        // Run test
        var tester = new Tester(testData, testContext);
        tester.execute();
      } catch (err) {
        if (global.debug && 
            (err.toString().includes('Error') || 
             err.toString().includes('Failed') || 
             err.toString().includes('Expected'))) {
          console.log(`\nDebugging due to error.\nError message is: ${err}`);
          browser.debug();
        }
        throw err;
      }
    }, testData.retry);
  });
});