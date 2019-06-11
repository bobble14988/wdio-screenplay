import NavigateTask from './tasks/navigate-task';
import SignInTask from './tasks/sign-in-task';
import CreateAccountTask from './tasks/create-account-task';

export default class TaskFactory {
  static issue(testContext, task) {
    switch (task.task) {
      case 'navigate':
        return new NavigateTask(testContext, task);
      case 'signIn':
        return new SignInTask(testContext, task);
      case 'createAccount':
        return new CreateAccountTask(testContext, task);
      default:
        throw new Error(`Cannot instansiate task of type ${task.task}.`);
    }
  }
}