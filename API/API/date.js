/**
 * @module Date
 * @description This module help for things who needs Date relative elements.
 * @example <caption>Use this module from another file.</caption>
 * const date = require('./date')
*/
module.exports = {
    /**
     * Get current date as DD/MM/YYYY
     * @returns {string} Current date as DD/MM/YYYY
     */
    GetDate: function () {
        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        return (date + "-" + month + "-" + year);
    },
    /**
     * Get current time as HH/MM/SS
     * @returns {string} Current time as HH/MM/SS
     */
    GetTime: function () {
        let date_ob = new Date();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();
        return (hours + ":" + minutes + ":" + seconds)
    },
    /**
     * Get current timestamp
     * @returns {int} Current timestamp converted in s.
     */
    GetTimestamp: function() {
        return  Math.round(Date.now() / 1000);
    },
    /**
     * Wait for specified amount of time 
     * @deprecated Use setTimeout instead.
     * @param {int} milliseconds Time to wait in milliseconds
     */
    Wait: function(milliseconds) {
        const date = Date.now();
        let currentDate = null;
        do {
          currentDate = Date.now();
        } while (currentDate - date < milliseconds);
    }
}