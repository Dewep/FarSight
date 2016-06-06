'use strict';

var locations = require("log/locations");
var spawn = require('child_process').spawn;
var readline = require('readline');
var fs = require('fs');
var path = require('path');
var os = require('os');

var LogWatcher = function (handler) {
    this.handler = handler;
    this.watcher = null;
};

LogWatcher.prototype.startWatcher = function () {
    var watcher_file = path.normalize(__dirname + "/../../log-parser/stream.py");
    var self = this;

    this.watcher = spawn("python", ["-u", watcher_file]);
    this.watcher.stdout.on("data", function(data) {
        self.onWatcherData(data.toString());
    });
    this.watcher.on('error', (err) => {
        console.warn('Failed to start child process.', err.toString());
    });
    this.watcher.stdout.on('end', function() {
        console.warn("End of watcher.");
    });
    this.watcher.stderr.on('data', (data) => {
        console.warn("stderr:", data.toString());
    });
    this.watcher.on('close', (code) => {
        console.warn("child process exited with code", code);
    });
};

LogWatcher.prototype.onWatcherData = function (data) {
    var self = this;

    data.split(os.EOL).forEach(function (line) {
        if (line.length > 1) {
            self.handler(JSON.parse(line));
        }
    });
};

LogWatcher.prototype.readFile = function (file_path) {
    const rl = readline.createInterface({
        input: fs.createReadStream(file_path)
    });

    var self = this;
    rl.on('line', (line) => {
        self.parseLine(line);
    });
};

LogWatcher.prototype.parseLine = function (line) {
    this.watcher.stdin.write(line + "\n");
};


module.exports.LogWatcher = LogWatcher;

module.exports.Handler = function Handler(refresh_handler) {
    var file_path = locations.powerLogFile;
    file_path = __dirname + "/../../../Power.log";

    var log_watcher = new LogWatcher(refresh_handler);
    log_watcher.startWatcher();
    //log_watcher.readFile(file_path);
};
