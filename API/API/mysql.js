var mysql = require('mysql'); // Required for the REST API to work.
const { ERROR_CODES } = require('./error_codes');
const config = require('./config.json')
var con = mysql.createConnection(config.Database_Config);

function handleDisconnect() { // This thing reconnect the database.
    con = mysql.createConnection(config.Database_Config);  
    con.connect( function onConnect(err) {   // The server is either down
        if (err) {                                  // or restarting (takes a while sometimes).
            console.error('error when connecting to db:', err);
            setTimeout(handleDisconnect, 10000);    // We introduce a delay before attempting to reconnect,
        }                                           // to avoid a hot loop, and to allow our node script to
    });                                             // process asynchronous requests in the meantime.
                                                    // If you're also serving http, display a 503 error.
    con.on('error', function onError(err) {
        console.error('db error', err);
        if (err.code == 'PROTOCOL_CONNECTION_LOST') {   // Connection to the MySQL server is usually
            handleDisconnect();                         // lost due to either server restart, or a
        } else {                                        // connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}
handleDisconnect();

function CheckUserCredentials(mail,callback) {
    ToReturn = new Object();
    ToReturn.error = ERROR_CODES.ErrorOK
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
    ToReturn = new Object();
    ToReturn.error = ERROR_CODES.ErrorOK
    con.query("SELECT id, trackerName FROM CredentialsTracker where id_user = '"+user_id+"'", (err, result) => {
        ToReturn = new Object();
        ToReturn.error = ERROR_CODES.ErrorOK
        if (err) {
            console.error(err)
            ToReturn.error = ERROR_CODES.ErrorSQLUnavailable
        }
        else{
            if(result[0] == undefined){
                ToReturn.error = ERROR_CODES.ErrorUserHasNoTracker
            }
            else{
                ToReturn.iotArray = result
            }
        }
    callback(ToReturn);
    });
}

function GetTrackersStatusList(token,callback) {
    ToReturn = new Object();
    ToReturn.error = ERROR_CODES.ErrorOK
    con.query("SELECT status_charge, status_bat, status_alarm, status_online, status_ecomode, status_protection, status_vh_charge, status_gps, id_iot, timestamp FROM Status_IOT where id_iot= (SELECT id FROM CredentialsTracker WHERE id_user = (SELECT id FROM users where token='"+token+"'))", (err, result) => {
        if (err) {
            console.error(err)
            ToReturn.error = ERROR_CODES.ErrorSQLUnavailable
        }
        else{
            if(result[0] == undefined){
                ToReturn.error = ERROR_CODES.ErrorSQLSelectError
            }
            else{
                ToReturn.status_list = result
            }
        }
    callback(ToReturn);
    }); 
}

function GetTrackerPosition(id_iot,callback) {
    ToReturn = new Object();
    ToReturn.error = ERROR_CODES.ErrorOK
    con.query("SELECT lat ,lon ,timestamp FROM Pos_IOT WHERE id_iot='"+id_iot+"'", (err, result) => {
        if (err) {
            console.error(err)
            ToReturn.error = ERROR_CODES.ErrorSQLUnavailable
        }
        else{
            if(result[0] == undefined){
                ToReturn.error = ERROR_CODES.ErrorSQLSelectError
            }
            else{
                ToReturn.history = result
            }
        }
    callback(ToReturn);
    });
}
function SetTrackerStatus(id_iot,status_charge,status_bat,status_alarm,status_ecomode,status_protection,status_vh_charge,callback) {
    ToReturn = new Object();
    ToReturn.error = ERROR_CODES.ErrorOK
    con.query("UPDATE Status_IOT SET status_charge = '"+status_charge+"',status_bat = '"+status_bat+"',status_alarm = '"+status_alarm+"',status_ecomode = '"+status_ecomode+"',status_protection = '"+status_protection+"',status_vh_charge = '"+status_vh_charge+"' WHERE id_iot='"+id_iot+"'", (err, result) => {
        if (err) {
            console.error(err)
            ToReturn.error = ERROR_CODES.ErrorSQLUnavailable
        }
    callback(ToReturn);
    });
}

function GetUserInformation(token,callback) {
    ToReturn = new Object();
    ToReturn.error = ERROR_CODES.ErrorOK
    con.query("SELECT id FROM users WHERE token='"+token+"'", (err, result) => {
        if (err) {
            console.error(err)
            ToReturn.error.Message = err
            ToReturn.error.ErrorCode = 10
        }
        else{
            if(result[0] == undefined){
                ToReturn.error = ERROR_CODES.ErrorUserTokenIsInvalid
            }
            else{
                ToReturn.id = result[0].id
            }
        }
    callback(ToReturn);
    });
}

function AddUserToDb(mail,password,token,callback) {
    ToReturn = new Object();
    ToReturn.error = ERROR_CODES.ErrorOK
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
    GetUserInformation: function(token,callback) {
        GetUserInformation(token,callback)
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
    GetTrackerPosition: function(id_iot,callback) {
        GetTrackerPosition(id_iot,callback)
    },
    GetTrackersStatusList: function(token,callback) {
        GetTrackersStatusList(token,callback)
    },
    SetTrackerStatus: function(id_iot,status_charge,status_bat,status_alarm,status_ecomode,status_protection,status_vh_charge,callback) {
        SetTrackerStatus(id_iot,status_charge,status_bat,status_alarm,status_ecomode,status_protection,status_vh_charge,callback)
    },
}