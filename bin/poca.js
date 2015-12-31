#!/usr/bin/env node

var log = require('../lib/log');
var config = require('../lib/config');
var script = require('../lib/script');

var app, configData;
var colName, collection, command;

try {
    configData = config.load();
} catch(err) {
    log.error(err);
    log.error('Failed to load config file. Exiting...');
    process.exit(1);
}

app = require('commander');

app.version(require('../package.json').version);
app.arguments('<collection> <command>');
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

command = app.args[1];
if (!command) {
    log.error('No command specified.');
    app.help();
}

try {
    script.run({
        collection: collection,
        command: command,
        args: app.args.slice(2),
    });
} catch (err) {
    log.error(err);
    process.exit(1);
}

