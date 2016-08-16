// Description: HearthStone Log file location
// Author: Aurelien

var os = require('os');
var path = require('path');

// Detect the operating system (Win or Mac - HearthStone is not available on Unix/Linux)
if (/^win/.test(os.platform())) {
    var programFiles = 'Program Files';

    // Detect architecture system
    if (/64/.test(os.arch())) {
        programFiles += ' (x86)';
    }

    module.exports.powerLogFile = path.join('C:', programFiles, 'Hearthstone', 'Logs', 'Power.log');
    module.exports.configFile = path.join(process.env.LOCALAPPDATA, 'Blizzard', 'Hearthstone', 'log.config');
} else {
    module.exports.powerLogFile = path.join('/Applications', 'Hearthstone', 'Logs', 'Power.log');
    module.exports.configFile = path.join(process.env.HOME, 'Library', 'Preferences', 'Blizzard', 'Hearthstone', 'log.config');
}
