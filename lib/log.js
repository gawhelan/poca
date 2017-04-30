'use strict';

const util = require('util');
const colors = require('colors/safe');
const appName = require('../package.json').name;

const appPrefix = '[' + appName + ']';

function addPrefix(message) {
    const args = Array.prototype.slice.call(arguments);
    return appPrefix + ' ' + args.join(' ');
}

function info(message) {
    message = util.format.apply(null, arguments);
    console.info(colors.green(addPrefix('[INFO]', message)));
}

function warn(message) {
    message = util.format.apply(null, arguments);
    console.warn(colors.yellow(addPrefix('[WARN]', message)));
}

function error(message) {
    message = util.format.apply(null, arguments);
    console.error(colors.red(addPrefix('[ERROR]', message)));
}


module.exports = {
    info: info,
    warn: warn,
    error: error,
};
