import TaskFactory from './task-factory';
import ConditionFactory from './condition-factory';

export default class Tester {
  constructor(testData, testContext) {
    this.testData = testData;
    this.testContext = testContext;
    console.log(`***\nTest created.\nID: ${this.testData.id}\nName: ${this.testData.description}\n***`);
  }

  execute() {
    if (global.only && global.only !== this.testData.id) {
      console.log(`Skipping ${this.testData.id} because argument 'only' is set to ${global.only} `);
      pending();
    }

    if (this.testData.ignore) {
      console.log(`Skipping ${this.testData.id} because of ${this.testData.reason}`);
      pending();
    }

    var startTime = new Date();

    console.log(`Executing ${this.testData.id} at ${startTime.toLocaleString()}`);

    // Run setup tasks
    for (var i = 0; i < this.testData.setUpTasks.length; i++) {
      // Validate pre-conditions
      for (var j = 0; j < this.testData.setUpTasks[i].preConditions.length; j++) {
        ConditionFactory.issue(this.testData.setUpTasks[i].preConditions[j]).execute();
      }
      // Execute step
      TaskFactory.issue(this.testContext, this.testData.setUpTasks[i]).execute();
      // Validate post-conditions
      for (var j = 0; j < this.testData.setUpTasks[i].postConditions.length; j++) {
        ConditionFactory.issue(this.testData.setUpTasks[i].postConditions[j]).execute();
      }
    }

    // Run test tasks
    for (var i = 0; i < this.testData.testTasks.length; i++) {
      // Validate pre-conditions
      for (var j = 0; j < this.testData.testTasks[i].preConditions.length; j++) {
        ConditionFactory.issue(this.testData.testTasks[i].preConditions[j]).execute();
      }
      // Execute step
      TaskFactory.issue(this.testContext, this.testData.testTasks[i]).execute();
      // Validate post-conditions
      for (var j = 0; j < this.testData.testTasks[i].postConditions.length; j++) {
        ConditionFactory.issue(this.testData.testTasks[i].postConditions[j]).execute();
      }
    }

    // Run teardown tasks
    for (var i = 0; i < this.testData.tearDownTasks.length; i++) {
      // Validate pre-conditions
      for (var j = 0; j < this.testData.tearDownTasks[i].preConditions.length; j++) {
        ConditionFactory.issue(this.testData.tearDownTasks[i].preConditions[j]).execute();
      }
      // Execute step
      TaskFactory.issue(this.testContext, this.testData.tearDownTasks[i]).execute();
      // Validate post-conditions
      for (var j = 0; j < this.testData.tearDownTasks[i].postConditions.length; j++) {
        ConditionFactory.issue(this.testData.tearDownTasks[i].postConditions[j]).execute();
      }
    }

    var endTime = new Date();
    var duration = endTime - startTime;

    console.log(`Finished ${this.testData.id} at ${endTime.toLocaleString()} (duration ${this.millisToMinutesAndSeconds(duration)})`);
    console.log(`Test Context: ${JSON.stringify(this.testContext)}`);
  }

  millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }
}