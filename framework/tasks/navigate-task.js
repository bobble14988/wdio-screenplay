import AbstractTask from "./abstract-task";

import { app } from "../app";

export default class NavigateTask extends AbstractTask {
  execute() {
    console.log(`Running task ${this.task}`);

    var envUrl;
    switch(global.environment) {
      case "local":
        envUrl = app.environments.local.url;
        break;
      case "fat":
        envUrl = app.environments.fat.url;
        break;
      case "sit":
        envUrl = app.environments.sit.url;
        break;
      default:
        throw new Error(`Do not recognise environment with name ${global.environment}.`);
    }

    browser.url(envUrl + this.data.path);
  }
}