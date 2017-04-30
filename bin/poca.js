#!/usr/bin/env node

'use strict';

const log = require('../lib/log');
const config = require('../lib/config');
const script = require('../lib/script');

let app, configData;
let colName, scriptName, collection;

try {
  configData = config.load();
} catch (err) {
  log.error(err);
  log.error('Failed to load config file. Exiting...');
  process.exit(1);
}

app = require('commander');

app.version(require('../package.json').version);
app.arguments('<collection> <script>');
app.parse(process.argv);

colName = app.args[0];
if (!colName) {
  log.error('No collection specified.');
  app.help();
}

collection = config.getCollection(configData, colName);
if (!collection) {
  log.error('Unknown collection: ' + colName);
  process.exit(1);
}

scriptName = app.args[1];
if (!scriptName) {
  log.error('No script specified.');
  app.help();
}

try {
  script.run({
    collection: collection,
    script: scriptName,
    args: app.args.slice(2),
  });
} catch (err) {
  log.error(err);
  process.exit(1);
}
