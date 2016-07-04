var locations = require("lib/log/locations");
var spawn = require('child_process').spawn;
var readline = require('readline');
var fs = require('fs');
var path = require('path');
var os = require('os');

var LogWatcher = function (handler) {
    this.handler = handler;
    this.watcher = null;
};

LogWatcher.prototype.startStream = function () {
    var watcher_file = path.normalize(__dirname + "/../../log-parser/stream.py");
    var self = this;

    if (/^win/.test(os.platform())) {
        this.watcher = spawn("python", ["-u", watcher_file]);
    } else {
        this.watcher = spawn("python3", ["-u", watcher_file]);
    }
    this.watcher.stdout.on("data", function(data) {
        self.onStreamData(data.toString());
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

LogWatcher.prototype.onStreamData = function (data) {
    var self = this;

    data.split(os.EOL).forEach(function (line) {
        if (line.length > 1) {
            var obj = JSON.parse(line);
            if (obj["type"] == "debug") {
                console.log("stream-debug", obj);
            }
            self.handler(obj);
        }
    });
};

LogWatcher.prototype.watchFile = function (file_path) {
    var self = this;
    var fileSize = fs.statSync(file_path).size;
    setInterval(function(){
        var newFileSize = fs.statSync(file_path).size;
        var sizeDiff = newFileSize - fileSize;
        if (sizeDiff < 0) {
            fileSize = 0;
            sizeDiff = newFileSize;
        }
        var buffer = new Buffer(sizeDiff);
        var fileDescriptor = fs.openSync(file_path, "r");
        fs.readSync(fileDescriptor, buffer, 0, sizeDiff, fileSize);
        fs.closeSync(fileDescriptor);
        fileSize = newFileSize;

        buffer.toString().split("\n").forEach(function (line) {
            line.replace("\r", "");
            self.parseLine(line);
        });
    }, 1000);
};

LogWatcher.prototype.readFile = function (file_path, callback_end) {
    const rl = readline.createInterface({
        input: fs.createReadStream(file_path)
    });

    var self = this;
    rl.on('line', (line) => {
        self.parseLine(line);
    });
    rl.on('close', callback_end);
};

LogWatcher.prototype.parseLine = function (line) {
    if (line.length) {
        this.watcher.stdin.write(line + "\n");
    }
};


module.exports.LogWatcher = LogWatcher;

module.exports.Handler = function Handler(refresh_handler) {
    var file_path = locations.powerLogFile;

    var log_watcher = new LogWatcher(refresh_handler);

    log_watcher.startStream();

    log_watcher.readFile(file_path, function(arg) {
        log_watcher.parseLine("START_WATCH_FILE");
        log_watcher.watchFile(file_path);
    });
};
