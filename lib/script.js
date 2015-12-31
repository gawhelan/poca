var url = require('url');
var path = require('path');
var fs = require('fs');
var tmp = require('tmp');
var execFileSync = require('child_process').execFileSync;
var request = require('request');

var log = require('./log');


function getFullUrl(collection, script) {
    var urlObj;

    urlObj = url.parse(collection.url);
    urlObj.pathname = path.join(urlObj.pathname, script);

    return url.format(urlObj);
}

function executeScript(script) {
    var tmpFile;

    try {
        tmpFile = tmp.fileSync({mode: 0755});
        fs.writeFileSync(tmpFile.name, script);
        execFileSync(tmpFile.name, {stdio: [0, 1, 2]});
    } catch (err) {
        log.error(err);
    }
}

function runScript(collection, script) {
    var fullUrl;

    if (!collection) {
        throw new Error('No collection specified.');
    }

    if (!collection.url) {
        throw new Error('No URL defined for collection.');
    }

    if (!script) {
        throw new Error('No script specified.');
    }

    fullUrl = getFullUrl(collection, script);
    request(fullUrl, function (err, res, body) {
        if (err) {
            log.error('Failed to fetch script: ' + err);
            return;
        }

        if (res.statusCode >= 300) {
            log.error('HTTP error fetching script: ' + res.statusCode);
            return;
        }

        executeScript(body);
    });
}

module.exports = {
    run: runScript,
};
