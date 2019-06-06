import NavigateTask from './tasks/navigate-task';
import LoginTask from './tasks/login-task';

export default class TaskFactory {
  static issue(testContext, task) {
    switch (task.task) {
      case 'navigate':
        return new NavigateTask(testContext, task);
      case 'login':
        return new LoginTask(testContext, task);
      default:
        throw new Error(`Cannot instansiate task of type ${task.task}.`);
    }
  }
}