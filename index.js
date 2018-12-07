/**
 * @license
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Sidney Bofah
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
'use strict';


/**
 * @module SpecialkeyEmulator
 */

/** Required */
var bindings = require('bindings'),
    chalk = require('chalk'),
    os = require('os');


/** Native Binding */
var nativeSpecialkeyEmulator = bindings('specialkeyEmulator.node');


/**
 * Error messages
 *
 * @readonly
 * @constant
 */
var ERROR_KEYNAME_MISSING = 'Keyname required',
    ERROR_KEYNAME_NOTSTRING = 'Keyname is not a string',
    ERROR_PLATFORM_UNKNOWN = 'Platform unknown',
    ERROR_KEY_UNKNOWN = 'Key unknown';


/**
 * Returns NodeJS-compliant name for current platform. Wrapper for NodeJS' ('os').type().
 *
 * @returns {Boolean|String} - 'Darwin', 'Windows_NT', 'Linux'
 * @private
 */
var getPlatform = function() {

    if (!os.type() || typeof os.type() !== 'string') {
        return false;
    }

    return os.type();
};

/**
 * Internal logger
 *
 * @param {String} logMessage - Log message
 * @param {*=} logVariable - (optional) Variable
 * @private
 */
var log = function(logMessage, logVariable) {

    // Style
    var style = chalk.red,
        styleBold = chalk.bold.red;

    // Message
    var logPrefix = '[' + require('./package.json')['name'] + ']' + ' ',
        logMessageFormatted = styleBold(logPrefix) + style(logMessage.trim());

    // Variable (optional)
    if (logVariable) {
        logMessageFormatted = logMessageFormatted + style(': ' + logVariable);
    }

    console.log(logMessageFormatted);
};


/**
 * @typedef {(Object)} KeyMap
 * @property {object} Darwin - OSX Map
 * @property {object} Windows_NT - Windows Map
 * @property {object} Linux - Linux Map
 */

/**
 * Returns a code (that is, a platform-specific internal representation) for a given keyboard key, passed as a string.
 * Requires Node-compliant platform type identifiers.
 *
 * @see {@link https://nodejs.org/api/os.html#os_os_type|NodeJS OS API}
 * @see {@link http://www.opensource.apple.com/source/IOHIDFamily/IOHIDFamily-86.1/IOHIDSystem/IOKit/hidsystem/ev_keymap.h|Darwin Keyboard Events}
 * @type KeyMap
 * @readonly
 * @constant
 * @default
 */
var MEDIAKEY_MAP = {
    Darwin: {
        'NX_KEYTYPE_SOUND_UP': 0,
        'NX_KEYTYPE_SOUND_DOWN': 1,
        'NX_KEYTYPE_BRIGHTNESS_UP': 2,
        'NX_KEYTYPE_BRIGHTNESS_DOWN': 3,
        'NX_KEYTYPE_CAPS_LOCK': 4,
        'NX_KEYTYPE_HELP': 5,
        'NX_KEYTYPE_POWER_KEY': 6,
        'NX_KEYTYPE_MUTE': 7,
        'NX_KEYTYPE_UP_ARROW_KEY': 8,
        'NX_KEYTYPE_DOWN_ARROW_KEY': 9,
        'NX_KEYTYPE_NUM_LOCK': 10,
        'NX_KEYTYPE_CONTRAST_UP': 11,
        'NX_KEYTYPE_CONTRAST_DOWN': 12,
        'NX_KEYTYPE_LAUNCH_PANEL': 13,
        'NX_KEYTYPE_EJECT': 14,
        'NX_KEYTYPE_VIDMIRROR': 15,
        'NX_KEYTYPE_PLAY': 16,
        'NX_KEYTYPE_NEXT': 17,
        'NX_KEYTYPE_PREVIOUS': 18,
        'NX_KEYTYPE_FAST': 19,
        'NX_KEYTYPE_REWIND': 20,
        'NX_KEYTYPE_ILLUMINATION_UP': 21,
        'NX_KEYTYPE_ILLUMINATION_DOWN': 22,
        'NX_KEYTYPE_ILLUMINATION_TOGGLE': 23
    },
    Windows_NT: {},
    Linux: {}
};


/**
 * Takes a key name (string representation).
 * Returns a key code integer for supplied key name.
 * Returns false if invalid.
 *
 * @type {Function}
 * @param {String} keyName - String representation of HID key
 * @param {String} platform - Platform for which to resolve keyName
 * @param {KeyMap} map - Dictionary to use for resolving a keyCode
 * @returns {Boolean|Number} - Integer representation of HID key
 * @private
 */
var resolveKey = function(keyName, platform, map) {

    // Init
    var platformKeymap = map[platform];

    // Key not supplied
    if (typeof keyName === 'undefined') {
        log(ERROR_KEYNAME_MISSING);
        return false;
    }

    // Key is not a String
    if (typeof keyName !== 'string') {
        log(ERROR_KEYNAME_NOTSTRING, keyName);
        return false;
    }

    // Platform not supported
    if (!platformKeymap) {
        log(ERROR_PLATFORM_UNKNOWN, platform);
        return false;
    }

    // Key not supported
    if (!platformKeymap.hasOwnProperty(keyName)) {
        log(ERROR_KEY_UNKNOWN, keyName);
        return false;
    }

    return platformKeymap[keyName];

};


/**
 * Called after trying to trigger the special key.
 *
 * @callback keyCallback
 * @param {Error} error
 * @param {Number} result - Code of the key that was called.
 * @private
 */


/**
 * Simulates triggering of platform-specific 'special' keyboard events, enabling control over system-level aspects, depending on the current platform.
 * Examples: Media playback control, display brightness or platform-specific features such as 'Mission Control' (OSX) or 'Application Key' (Windows).
 *
 * @constructor
 * @type {Function}
 * @param {String} keyName - Name of the key to be triggered.
 * @param {keyCallback..} [keyCallback] - Called with result
 * @public
 */
function SpecialkeyEmulator(keyName, keyCallback) {

    // Init
    var keyCode = resolveKey(keyName, getPlatform(), MEDIAKEY_MAP),
        callback = function() {};

    // If a callback function is provided - use it
    if (keyCallback && typeof keyCallback === 'function') {
        callback = keyCallback;
    }

    // Error: Key could not be resolved
    if (typeof keyCode === 'undefined') {
        return callback(new Error('Mediakey name Error.'));
    } else {
      var result = nativeSpecialkeyEmulator.emit(keyCode);

      if (result === keyCode) {
          return callback(null, keyCode);
      }
    }
}

exports = module.exports = SpecialkeyEmulator;
