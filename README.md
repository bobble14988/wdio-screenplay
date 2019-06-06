# Automated UI Tests with Data-Driven Screenplay Pattern Model
Instructions below for running automated UI tests.
### One-Time Setup
```
cd <workspace-dir>/wealth/test/ui
npm install
```
### Before Each Run
Run the below in a separate terminal window and keep open.
```
node_modules/.bin/webdriver-manager update
node_modules/.bin/webdriver-manager start
```
If your browser version is not up to date, see the link below on how to adjust the installed driver versions:
https://github.com/angular/webdriver-manager/blob/master/docs/versions.md

TL;DR: `--versions.chrome=<driver-version>`

Chrome/chromedriver compatibility information: https://sites.google.com/a/chromium.org/chromedriver/downloads
### Executing Tests
```
npm run smoke-tests -- --env [local|fat|sit]
```
The available environments are as follows:
```
"local": { "url": "http://localhost:5000/" },
"fat": { "url": "https://fat.mytestenvironment.com/" },
"sit": { "url": "https://sit.mytestenvironment.com/" }
```
### Available Parameters
`--env <env-name>` (Required) Provides the environment to run against. Must match an environment in `app.json`.

`--only <test-id>` Only executes one test in the pack with the given ID.

`--debug` Pauses execution upon a test failure to enable debugging.

`--validateFields` Validates UI input field rules. Rules specified within element.js -> validateFieldRules() function.

`--takeScreenshot` Takes a screenshot where instructed in the test tasks' execute() functions.

`--browserReset` Kills Chrome with 'pkill Chrome' command during framework initialisation.