// Description: Core AI (containing all functions handling data used by the different features)
// Author: Aurelien (watcher, events), Florent (communication, JSON serialisation, spawn python script)

var locations = require("lib/log/locations"); // HearthStone log file location
var spawn = require('child_process').spawn; // Spawn NodeJS library
var readline = require('readline');
var fs = require('fs');
var path = require('path');
var os = require('os');

// LogWatcher class
var LogWatcher = function (handler) {
    this.handler = handler;
    this.watcher = null;
};

// Spawn python script (stream.py) to parse log lines
LogWatcher.prototype.startStream = function () {
    // Path to the Python Script
    var watcher_file = path.normalize(__dirname + "/../../log-parser/stream.py");
    var self = this;

    // Need to be run with Python 3
    if (/^win/.test(os.platform())) {
        this.watcher = spawn("python", ["-u", watcher_file]);
    } else {
        this.watcher = spawn("python3", ["-u", watcher_file]);
    }

    // On data events
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

// On data event
LogWatcher.prototype.onStreamData = function (data) {
    var self = this;

    // JSON deserialisation for every line
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

// Watch the log file every second, reading what has been appened since last reading.
LogWatcher.prototype.watchFile = function (file_path) {
    var self = this;
    var fileSize = fs.statSync(file_path).size;

    // Custom watch function instead of the system function for optimisation
    setInterval(function(){
        // Compute the difference size
        var newFileSize = fs.statSync(file_path).size;
        var sizeDiff = newFileSize - fileSize;
        if (sizeDiff < 0) { // Reset if negative value
            fileSize = 0;
            sizeDiff = newFileSize;
        }

        // Read new content only
        var buffer = new Buffer(sizeDiff);
        var fileDescriptor = fs.openSync(file_path, "r");
        fs.readSync(fileDescriptor, buffer, 0, sizeDiff, fileSize);
        fs.closeSync(fileDescriptor);
        fileSize = newFileSize;

        // Parse each line
        buffer.toString().split("\n").forEach(function (line) {
            self.parseLine(line); // Parse line
        });
    }, 1000);
};

// Read content of a file
LogWatcher.prototype.readFile = function (file_path, callback_end) {
    const rl = readline.createInterface({
        input: fs.createReadStream(file_path)
    });

    var self = this;

    // Parse each line
    rl.on('line', (line) => {
        self.parseLine(line);
    });

    // Call callback_end when file reading is over
    rl.on('close', callback_end);
};

// Send each log line to the stdin of the Python script
LogWatcher.prototype.parseLine = function (line) {
    if (line.length) {
        line.replace("\r", ""); // Remove \r characters

        this.watcher.stdin.write(line + "\n");
    }
};


module.exports.LogWatcher = LogWatcher;

// Handler events
module.exports.Handler = function Handler(refresh_handler) {
    var file_path = locations.powerLogFile;
    var log_watcher = new LogWatcher(refresh_handler);

    // Spawn Python script
    log_watcher.startStream();

    // Read file, watch after
    log_watcher.readFile(file_path, function(arg) {
        log_watcher.parseLine("START_WATCH_FILE"); // Custom event

        log_watcher.watchFile(file_path);
    });
};
