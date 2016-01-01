var url = require('url');
var fs = require('fs');
var os = require('os');
var tmp = require('tmp');
var extend = require('extend');
var exec = require('child_process').exec;
var execFileSync = require('child_process').execFileSync;
var request = require('request');

var log = require('./log');


function getFullUrl(collection, script) {
    var urlObj;

    urlObj = url.parse(collection.url);
    urlObj.pathname = url.resolve(urlObj.pathname, script);

    return url.format(urlObj);
}

function executeScriptWin32(data, args, env) {
    var tmpFile;
    var filename, cmd;
    var child;

    if (args && args.length) {
        args = '"' + args.join('" "') + '"';
    }

    try {
        tmpFile = tmp.fileSync();
        fs.writeFileSync(tmpFile.name, data);
    } catch (err) {
        log.error(err);
        return;
    }

    filename = tmpFile.name.replace('\\', '\\\\');
    cmd = 'sh -c \'"' + filename + '" ' + args + '\'';
    child = exec(cmd, {env: env}, function (err) {
        if (err) {
            log.error(err);
        }
    });
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
}

function executeScript(data, args, env) {
    var tmpFile;

    if (os.platform() === 'win32') {
        return executeScriptWin32(data, args, env);
    }

    try {
        tmpFile = tmp.fileSync({mode: 0755});
        fs.writeFileSync(tmpFile.name, data);
        execFileSync(tmpFile.name, args || [], {
            stdio: 'inherit',
            env: env,
        });
    } catch (err) {
        log.error(err);
    }
}

function runScript(opts) {
    var fullUrl;
    var env;

    if (!opts.collection) {
        throw new Error('No collection specified.');
    }

    if (!opts.collection.url) {
        throw new Error('No URL defined for collection.');
    }

    if (!opts.script) {
        throw new Error('No script specified.');
    }

    fullUrl = getFullUrl(opts.collection, opts.script);
    request(fullUrl, function (err, res, body) {
        if (err) {
            log.error('Failed to fetch script: ' + err);
            return;
        }

        if (res.statusCode >= 300) {
            log.error('HTTP error fetching script: ' + res.statusCode);
            return;
        }

        env = extend({
            'POCA_COLLECTION': opts.collection.name,
            'POCA_SCRIPT': opts.script,
        }, process.env);

        executeScript(body, opts.args, env);
    });
}

module.exports = {
    run: runScript,
};
