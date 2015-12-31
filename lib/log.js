var colors = require('colors/safe');
var appName = require('../package.json').name;

var prefix = '[' + appName + '] ';


function info(message) {
    console.log(colors.green(prefix + '[INFO] ' + message));
}

function warn(message) {
    console.log(colors.yellow(prefix + '[WARN] ' + message));
}

function error(message){
    console.error(colors.red(prefix + '[ERROR] ' + message));
}


module.exports = {
    info: info,
    warn: warn,
    error: error,
};
