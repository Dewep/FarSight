'use strict';

var os = require('os');
var path = require('path');

if (/^win/.test(os.platform())) {
    var programFiles = 'Program Files';

    if (/64/.test(os.arch())) {
        programFiles += ' (x86)';
    }

    module.exports.powerLogFile = path.join('C:', programFiles, 'Hearthstone', 'Log', 'Power.log');
    module.exports.configFile = path.join(process.env.LOCALAPPDATA, 'Blizzard', 'Hearthstone', 'log.config');
} else {
    module.exports.powerLogFile = path.join('Applications', 'Hearthstone', 'Logs', 'Player.log');
    module.exports.configFile = path.join(process.env.HOME, 'Library', 'Preferences', 'Blizzard', 'Hearthstone', 'log.config');
}
