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
  if (!config || !Array.isArray(config.collections)) {
    return [];
  }

  let nameUsed = {};
  let dups = [];
  config.collections.forEach(collection => {
    const name = collection.name;
    if (nameUsed[name]) {
      dups.push(collection);
    } else {
      nameUsed[name] = true;
    }
  });

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
    log.warn(
      'Configuration file contains duplicate collections: ',
      dups.map(d => d.name)
    );
  }

  return config;
}

function getCollection(config, name) {
  if (!config || !Array.isArray(config.collections)) {
    return null;
  }

  return config.collections.find(c => c.name === name);
}

module.exports = {
  load: loadUserConfig,
  getCollection: getCollection,
};
