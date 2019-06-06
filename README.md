# Automated UI Tests
Instructions below for running automated UI tests.
### One-Time Setup
```
cd <workspace-dir>/wealth/test/ui
npm install
npm config set ui-tests:adviseruserid 1111CFK
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
npm run smoke-tests -- --env local

npm run regression-tests -- --env local
```
The available environments are as follows:
```
"local": { "url": "http://localhost:5000/" },
"demo": { "url": "https://demoax-mpwealthdev.msappproxy.net/" },
"ci": { "url": "https://ci2ax-mpwealthdev.msappproxy.net/" },
"buy": { "url": "https://buyax-mpwealthdev.msappproxy.net/" },
"fat": { "url": "https://fat2ax-mpwealthdev.msappproxy.net/" },
"sit": { "url": "https://sit2ax-mpwealthuat.msappproxy.net/" }
```
If your environment has Active Directory and/or PALA enabled, additional npm config parameters are required.
### Available Parameters
`--env <env-name>` Provides the environment to run against. Must match an environment in `app.json`.
`--only <test-id>` Only executes one test in the pack with the given ID.
`--debug <true|false>` Pauses execution upon a test failure to enable debugging.