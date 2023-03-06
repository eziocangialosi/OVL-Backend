/**
 * @module Encryption
 * @description This module handle the password encryption, to store securely all users passwords.
 * @example <caption>Use this module from another file.</caption>
 * const encryption = require('./encription')
*/
var bcrypt = require('bcrypt');
function EncryptPassword(plaintextPassword, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(plaintextPassword, salt, function (err, hash) {
            callback(hash)
        });
    })
}

module.exports = {
    /** Encrypt a password.
     * @param {String} pass - The password you want to encrypt.
     * @param {Function} callback - The callback to trigger after encrypt the password.
     * @example <caption>How to encrypt the password `ThisStrongPassword`."</caption>
     * encryption.EncryptPassword("ThisStrongPassword", function (hash) { console.log(hash) };
     * // Qfsdf531qsdgfq5s4etqzg
    */
    EncryptPassword: function (pass, callback) {
        EncryptPassword(pass, callback)
    },
}