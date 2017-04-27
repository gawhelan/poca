'use strict';

const colors = require('colors/safe');
const appName = require('../package.json').name;

const prefix = '[' + appName + '] ';


function info(message) {
    let args = Array.prototype.slice.call(arguments);
    args[0] = colors.green(prefix + '[INFO] ' + message);
    console.log.apply(console, args);
}

function warn(message) {
    let args = Array.prototype.slice.call(arguments);
    args[0] = colors.yellow(prefix + '[WARN] ' + message);
    console.log.apply(console, args);
}

function error(message) {
    let args = Array.prototype.slice.call(arguments);
    args[0] = colors.red(prefix + '[ERROR] ' + message);
    console.error.apply(console, args);
}


module.exports = {
    info: info,
    warn: warn,
    error: error,
};
