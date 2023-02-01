var bcrypt = require('bcrypt');
function EncryptPassword(plaintextPassword,callback)
{
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(plaintextPassword, salt, function(err, hash) {
            callback(hash)
            // Store hash in the database
        });
    })
}

module.exports = {
    EncryptPassword: function(pass,callback) {
        EncryptPassword(pass,callback)
    },

}