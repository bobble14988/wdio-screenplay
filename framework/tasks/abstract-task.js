export default class AbstractTask {
    constructor(testContext, task) {
        this.testContext = testContext;
        this.task = task.task;
        this.preConditions = task.preConditions;
        this.postConditions = task.postConditions;
        this.data = task.data;
        this.interrupts = task.interrupts;
    }

    getContext() {
        return this.testContext;
    }

    getTask() {
        return this.task;
    }

    getPreConditions() {
        return this.preConditions;
    }

    getPostConditions() {
        return this.postConditions;
    }

    getData() {
        return this.data;
    }

    getInterrupts() {
        return this.interrupts;
    }

    execute() {
        throw new Error(`The execute method on the AbstractTask class should not be called directly.`);
    }
}