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

function findDuplicateCollections(config) {
    var i, cols, name;
    var names = [];
    var dups = [];

    if (!config || !Array.isArray(config.collections)) {
        return [];
    }

    cols = config.collections;
    for (i = 0; i < cols.length; i++) {
        name = cols[i].name;
        if (names.indexOf(name) !== -1) {
            dups.push(name);
        } else {
            names.push(name);
        }
    }

    return dups;
}

function loadUserConfig(path) {
    var data, config;
    var dups;

    path = path || getUserConfigPath();
    data = fs.readFileSync(path, 'utf8');
    config = yaml.parse(data);

    dups = findDuplicateCollections(config);
    if (dups.length) {
        log.warn('Configuration file contains duplicate collections: ', dups);
    }

    return config;
}

function getCollection(config, name) {
    var i, cols;

    if (!config || !Array.isArray(config.collections)) {
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
