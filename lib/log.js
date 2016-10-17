var colors = require('colors/safe');
var appName = require('../package.json').name;

var prefix = '[' + appName + '] ';


function info(message) {
    var args = Array.prototype.slice.call(arguments);
    args[0] = colors.green(prefix + '[INFO] ' + message);
    console.log.apply(console, args);
}

function warn(message) {
    var args = Array.prototype.slice.call(arguments);
    args[0] = colors.yellow(prefix + '[WARN] ' + message);
    console.log.apply(console, args);
}

function error(message){
    var args = Array.prototype.slice.call(arguments);
    args[0] = colors.red(prefix + '[ERROR] ' + message);
    console.error.apply(console, args);
}


module.exports = {
    info: info,
    warn: warn,
    error: error,
};
