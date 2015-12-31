var path = require('path');
var fs = require('fs');
var yaml = require('yamljs');

var log = require('./log');


var configFilename = '.poca';

function getHome() {
    return process.env.HOME || process.env.USERPROFILE;
}

function getUserConfigPath() {
    return path.join(getHome(), configFilename);
}

function checkForDuplicateCollectionName(config) {
    var i, cols, name;
    var names = [];

    if (!config || !config.collections || !Array.isArray(config.collections)) {
        return null;
    }

    cols = config.collections;
    for (i = 0; i < cols.length; i++) {
        name = cols[i].name;
        if (names.indexOf(name) !== -1) {
            return name;
        }

        names.push(name);
    }

    return null;
}

function loadUserConfig(path) {
    var data, config;
    var name;

    path = path || getUserConfigPath();
    data = fs.readFileSync(path, 'utf8');
    config = yaml.parse(data);

    name = checkForDuplicateCollectionName(config);
    if (name) {
        log.warn('Configuration file contains duplicate collection: ' + name);
    }

    return config;
}

function getCollection(config, name) {
    var i, cols;

    if (!config || !config.collections || !Array.isArray(config.collections)) {
        return null;
    }

    cols = config.collections;
    for (i = 0; i < cols.length; i++) {
        if (cols[i].name === name) {
            return cols[i];
        }
    }
}

module.exports = {
    load: loadUserConfig,
    getCollection: getCollection,
};
