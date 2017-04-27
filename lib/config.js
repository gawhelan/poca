'use strict';

const path = require('path');
const fs = require('fs');
const yaml = require('yamljs');

const log = require('./log');


const configFilename = '.poca';

function getHome() {
    return process.env.HOME || process.env.USERPROFILE;
}

function getUserConfigPath() {
    return path.join(getHome(), configFilename);
}

function findDuplicateCollections(config) {
    let i, cols, name;
    let names = [];
    let dups = [];

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
    let data, config;
    let dups;

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
    let i, cols;

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
