var mysql = require('mysql'); // Required for the REST API to work.
const { ERROR_CODES } = require('./error_codes');
var con = mysql.createConnection({
    host: "192.168.1.18",
    user: "root",
    password: "Pornhub",
    database: "Test"
});

function handleDisconnect() { // This thing reconnect the database.
    con = mysql.createConnection({ // Recreate the connection, since the old one cannot be reused.
        host: "192.168.1.18",
        user: "root",
        password: "Pornhub",
        database: "Test"
    });  
    con.connect( function onConnect(err) {   // The server is either down
        if (err) {                                  // or restarting (takes a while sometimes).
            console.error('error when connecting to db:', err);
            setTimeout(handleDisconnect, 10000);    // We introduce a delay before attempting to reconnect,
        }                                           // to avoid a hot loop, and to allow our node script to
    });                                             // process asynchronous requests in the meantime.
                                                    // If you're also serving http, display a 503 error.
    con.on('error', function onError(err) {
        console.log('db error', err);
        if (err.code == 'PROTOCOL_CONNECTION_LOST') {   // Connection to the MySQL server is usually
            handleDisconnect();                         // lost due to either server restart, or a
        } else {                                        // connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}
handleDisconnect();

function GetErrorJson() {
    let ErrorJson = new Object()
    ErrorJson = ERROR_CODES.ErrorOK
    return ErrorJson
}

function CheckUserCredentials(mail,callback) {
    ToReturn = new Object();
    ToReturn.error = GetErrorJson();
    con.query("SELECT * FROM users WHERE email='"+mail+"'", (err, result) => {
        if (err) {
            console.error(err)
            ToReturn.error = ERROR_CODES.ErrorSQLUnavailable
        }
        else{
            if(result[0] == undefined){
                ToReturn.error = ERROR_CODES.ErrorUserNotFound
            }
            else{
                ToReturn.data = result[0]
            }
        }
    callback(ToReturn);
    });
}

function GetUserTrackers(user_id, callback) {
    con.query("SELECT id, trackerName FROM CredentialsTracker where id_user = '"+user_id+"'", (err, result) => {
        ToReturn = new Object();
        ToReturn.error = new Object();
        if (err) {
            console.error(err)
            ToReturn.error = ERROR_CODES.ErrorSQLUnavailable
        }
        else{
            if(result[0] == undefined){
                ToReturn.error = ERROR_CODES.ErrorUserHasNoTracker
            }
            else{
                ToReturn.data = result
            }
        }
    callback(ToReturn);
    });
}

function GetUserInformation(mail,pass,callback) {
    ToReturn = new Object();
    ToReturn.error = GetErrorJson();
    con.query("SELECT * FROM users WHERE email='"+mail+"' AND password='"+pass+"'", (err, result) => {
        if (err) {
            console.error(err)
            ToReturn.error.Message = err
            ToReturn.error.ErrorCode = 10
        }
        else{
            if(result[0] == undefined){
                ToReturn.error = ERROR_CODES.ErrorUserWrongCredentials
            }
            else{
                ToReturn.trackers = result[0]
            }
        }
    callback(ToReturn);
    });
}

function AddUserToDb(mail,password,token,callback) {
    ToReturn = new Object();
    ToReturn.error = GetErrorJson();
    con.query("SELECT * FROM users WHERE email='"+mail+"'", (err, result) => {
        if (err) {
            console.error(err)
            ToReturn.Message = err
            ToReturn.ErrorCode = 10
            throw err;
        }
        else{
            if(result[0] == undefined) {
                var sql = "INSERT INTO users (email, password, token) VALUES ('"+mail+"', '"+password+"', '"+token+"')";
                con.query(sql, function (err, result) {
                    if (err)
                    {
                        ToReturn.error = ERROR_CODES.ErrorSQLInjectError
                        throw err
                    }
                });
            }
            else{
                ToReturn.error = ERROR_CODES.ErrorUserAlreadyExist
            }   
        }
        callback(ToReturn)
    });
}

module.exports = {
    GetUserInformation: function(mail,pass,callback) {
        GetUserInformation(mail,pass,callback)
    },
    AddUserToDb: function(mail,pass,token,callback) {
        AddUserToDb(mail,pass,token,callback)
    },
    CheckUserCredentials: function(mail,callback) {
        CheckUserCredentials(mail,callback)
    },
    GetUserTrackers: function(user_id, callback) {
        GetUserTrackers(user_id, callback)
    },
}