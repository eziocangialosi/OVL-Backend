/**
 * @module Debug
 * @description This module countains debug functions.
 * @example <caption>Use this module from another file.</caption>
 * const debug = require('./debug')
*/
const date = require('./date')
const config = require('./config')
const fs = require('fs');

module.exports = { // Export funtion for other file to use it.
    /** Print data to console with date and time formating.
     * @param {string} data - What you wan't to be in the console.log.
     * @example <caption>How to print "Im Iron Man."</caption>
     * debug.Print("Im Iron Man")
     * // [DD/MM/YYYY] - [HH/MM/SS] -> Im Iron Man
    */
    Print: function(data) {
        if (config.Debug == true) {
            str = "[" + date.GetDate() + "] [" + date.GetTime() + "] -> " + data + "\n"
            console.log(str)
            fs.appendFile('Logs.log', str, function (err) {
                if (err) throw err;
              });
        }
    }
}