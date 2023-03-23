const mysql = require('./mysql')
const debug = require('./debug') // Debug function.
function LogRequest(Request) {
    debug.Print(Request)
    setTimeout(() => {
        mysql.AddRequestLog(Request)
    }, 0);
    
}

function LogUserLogin(User) {
    //debug.Print(User)
    setTimeout(() => {
        mysql.AddUserLogin(User)
    }, 0);
}

module.exports = { // Export funtion for other file to use it.
    /**
     * Add a request to SQL logs..
     * @param {(String)} Request - The request description.
     */
    LogRequest: function (Request) {
        LogRequest(Request)
    },
    /**
     * Add a user login to SQL logs..
     * @param {(String)} User - The user id.
     */
    LogUserLogin: function (User) {
        LogUserLogin(User)
    },
}