var url = require('url');
var path = require('path');
var fs = require('fs');
var tmp = require('tmp');
var extend = require('extend');
var execFileSync = require('child_process').execFileSync;
var request = require('request');

var log = require('./log');


function getFullUrl(collection, script) {
    var urlObj;

    urlObj = url.parse(collection.url);
    urlObj.pathname = path.join(urlObj.pathname, script);

    return url.format(urlObj);
}

function executeScript(data, args, env) {
    var tmpFile;

    args = args || [];

    try {
        tmpFile = tmp.fileSync({mode: 0755});
        fs.writeFileSync(tmpFile.name, data);
        execFileSync(tmpFile.name, args, {
            stdio: [0, 1, 2],
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
