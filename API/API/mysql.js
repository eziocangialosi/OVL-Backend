/**
 * @module MySQL
 * @description This module handle the communication with the MariaDB Server, the configuration for the server connection can be edited in config.json.
 * @example <caption>Use this module from another file.</caption>
 * const mysql = require('./mysql')
*/
var mysql = require('mysql'); // Required for the REST API to work.
const debug = require('./debug')
const { ERROR_CODES } = require('./error_codes');
const config = require('./config')
var con = mysql.createConnection(config.Database_Config);
const date = require('./date')
const discord = require('./discord')
function handleDisconnect() { // This thing reconnect the database.
    con = mysql.createConnection(config.Database_Config);
    con.connect(function onConnect(err) {   // The server is either down
        if (err) {                                  // or restarting (takes a while sometimes).
            console.error('error when connecting to db --> ', err);
            setTimeout(handleDisconnect, 10000);    // We Introduce a delay before attempting to reconnect,
        }                                           // to avoid a hot loop, and to allow our node script to
        else {
            debug.Print("Successfully connected to the SQL Database.")
            discord.SendSucesssWebhook("Database","Connection","Successfully connected to the SQL Database.")
        }
    });                                             // process asynchronous requests in the meantime.
    // display a 503 error.
    con.on('error', function onError(err) {
        console.error('db error', err);
        if (err.code == 'PROTOCOL_CONNECTION_LOST') {   // Connection to the MySQL server is usually
            handleDisconnect();                         // lost due to either server restart, or a
        } else {                                        // connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}
handleDisconnect(); // This handle any disconnect from the SQL server.

function CheckUserCredentials(mail, callback) {
    ToReturn = new Object();
    ToReturn.error = ERROR_CODES.ErrorOK
    con.query("SELECT * FROM users WHERE email='" + mail + "'", (err, result) => {
        if (err) {
            console.error(err)
            ToReturn.error = err
        }
        else {
            if (result[0] == undefined) {
                ToReturn.error = ERROR_CODES.ErrorUserNotFound
            }
            else {
                ToReturn.data = result[0]
            }
        }
        callback(ToReturn);
    });
}

function GetUserTrackers(user_id, callback) {
    ToReturn = new Object();
    ToReturn.error = ERROR_CODES.ErrorOK
    con.query("SELECT id, trackerName FROM CredentialsTracker where id_user = '" + user_id + "'", (err, result) => {
        ToReturn = new Object();
        ToReturn.error = ERROR_CODES.ErrorOK
        if (err) {
            console.error(err)
            ToReturn.error = err
        }
        else {
            if (result[0] == undefined) {
                ToReturn.error = ERROR_CODES.ErrorUserHasNoTracker
            }
            else {
                ToReturn.iotArray = result
            }
        }
        callback(ToReturn);
    });
}

function GetTrackersStatusList(token, callback) {
    ToReturn = new Object();
    ToReturn.error = ERROR_CODES.ErrorOK
    con.query("SELECT status_charge, status_bat, status_alarm, status_online, status_ecomode, status_protection, status_vh_charge, status_gps, id_iot, timestamp FROM Status_IOT where id_iot in (SELECT id FROM CredentialsTracker WHERE id_user = (SELECT id FROM users where token='" + token + "'))", (err, result) => {
        if (err) {
            console.error(err)
            ToReturn.error = err
        }
        else {
            if (result[0] == undefined) {
                ToReturn.error = ERROR_CODES.ErrorSQLSelectError
            }
            else {
                ToReturn.status_list = result
            }
        }
        callback(ToReturn);
    });
}

function GetTrackerStatus(topic, callback) {
    ToReturn = new Object();
    ToReturn.error = ERROR_CODES.ErrorOK
    con.query("SELECT status_charge, status_bat, status_alarm, status_online, status_ecomode, status_protection, status_vh_charge, status_gps, id_iot, timestamp FROM Status_IOT where id_iot in (SELECT id FROM CredentialsTracker WHERE topicRX ='" + topic + "')", (err, result) => {
        if (err) {
            console.error(err)
            ToReturn.error = err
        }
        else {
            if (result[0] == undefined) {
                ToReturn.error = ERROR_CODES.ErrorSQLSelectError
                callback(ToReturn);
            }
            else {
                ToReturn.status = result[0]
                con.query("SELECT safeZoneDiam FROM CredentialsTracker WHERE id = '"+ToReturn.status.id_iot+"'", (err, result2) => {
                    if (err) {
                        console.error(err)
                        ToReturn.error = err
                    }
                    else {
                        if (result2[0] == undefined) {
                            ToReturn.error = ERROR_CODES.ErrorSQLSelectError
                        }
                        else {
                            ToReturn.status.safezone = result2[0].safeZoneDiam
                        }
                        callback(ToReturn);
                    }
                });
            }
        }
        
    });
}

function GetTrackerHistoryPosition(id_iot, callback) {
    ToReturn = new Object();
    ToReturn.error = ERROR_CODES.ErrorOK
    con.query("SELECT lat ,lon ,timestamp FROM Pos_IOT WHERE id_iot='" + id_iot + "'", (err, result) => {
        if (err) {
            console.error(err)
            ToReturn.error = err
        }
        else {
            if (result[0] == undefined) {
                ToReturn.error = ERROR_CODES.ErrorSQLSelectError
            }
            else {
                ToReturn.history = result
            }
        }
        callback(ToReturn);
    });
}

function GetTrackerLastPosition(id_iot, callback) {
    ToReturn = new Object();
    ToReturn.error = ERROR_CODES.ErrorOK
    con.query("SELECT lat ,lon ,timestamp FROM Pos_IOT WHERE id_iot='" + id_iot + "' ORDER BY id DESC LIMIT 1", (err, result) => {
        if (err) {
            console.error(err)
            ToReturn.error = err
        }
        else {
            if (result[0] == undefined) {
                ToReturn.notfound = true
            }
            else {
                ToReturn.now = result[0]
            }
        }
        callback(ToReturn);
    });
}

function SetTrackerStatus(id_iot, status_alarm, status_ecomode, status_protection, status_vh_charge, callback) {
    ToReturn = new Object();
    ToReturn.error = ERROR_CODES.ErrorOK
    con.query("UPDATE Status_IOT SET status_alarm = '" + status_alarm + "',status_ecomode = '" + status_ecomode + "',status_protection = '" + status_protection + "',status_vh_charge = '" + status_vh_charge + "' WHERE id_iot='" + id_iot + "'", (err, result) => {
        if (err) {
            console.error(err)
            ToReturn.error = err
        }
        callback(ToReturn);
    });
}

function GetUserInformation(token, callback) {
    ToReturn = new Object();
    ToReturn.error = ERROR_CODES.ErrorOK
    con.query("SELECT id FROM users WHERE token='" + token + "'", (err, result) => {
        if (err) {
            console.error(err)
            ToReturn.error = err
        }
        else {
            if (result[0] == undefined) {
                ToReturn.error = ERROR_CODES.ErrorUserTokenIsInvalid
            }
            else {
                ToReturn.id = result[0].id
            }
        }
        callback(ToReturn);
    });
}

function AddUserToDb(mail, password, token, callback) {
    ToReturn = new Object();
    ToReturn.error = ERROR_CODES.ErrorOK
    con.query("SELECT * FROM users WHERE email='" + mail + "'", (err, result) => {
        if (err) {
            console.error(err)
            ToReturn.error = err
        }
        else {
            if (result[0] == undefined) {
                var sql = "INSERT INTO users (email, password, token) VALUES ('" + mail + "', '" + password + "', '" + token + "')"
                con.query(sql, function (err, result) {
                    if (err) {
                        ToReturn.error = ERROR_CODES.ErrorSQLInjectError
                        throw err
                    }
                });
            }
            else {
                ToReturn.error = ERROR_CODES.ErrorUserAlreadyExist
            }
        }
        callback(ToReturn)
    });
}

function AddTrackerToUser(token, trackerName, password, callback) { // Used to add a new tracker in the following tables : CredentialsTracker, Status_IOT.
    ToReturn = new Object();
    ToReturn.error = ERROR_CODES.ErrorOK
    var UserId = 0
    var TrackerId = 0
    con.query("SELECT id FROM users WHERE token='" + token + "'", (err, result) => { // We get the user id from his token.
        if (err) {
            console.error(err)
            ToReturn.error = err
            callback(ToReturn)
        }
        else {
            if (result[0] != undefined) {
                UserId = result[0].id
                con.query("SELECT COUNT(id) AS ID FROM CredentialsTracker", (err, result) => { // We get the tracker id used in the topic suffix.
                    if (err) {
                        console.error(err)
                        ToReturn.error = err
                        callback(ToReturn)
                    }
                    else { // If nothing fail.
                        TrackerId = result[0].ID + 1 // As the result only count the existing entries we add 1.
                        con.query("INSERT INTO CredentialsTracker (trackerName, MQTTpswd, topicRX, topicTX, id_user, safeZoneDiam, lonSfz, latSfz) VALUES ('" + trackerName + "', '" + password + "', 'topicRX_" + TrackerId + "', 'topicTX_" + TrackerId + "','" + UserId + "','15','0.0','0.0')", function (err, result) {
                            if (err) {
                                console.error(err)
                                ToReturn.error = err
                                callback(ToReturn)
                            }
                            else { // If nothing fail.
                                con.query("INSERT INTO Status_IOT (id_iot,timestamp) VALUES ('" + TrackerId + "', '" + date.GetTimestamp() + "')", function (err, result) {
                                    if (err) {
                                        console.error(err)
                                        ToReturn.error = err
                                    }
                                    else { // If nothing have failed we return the two topics of the tracker.
                                        ToReturn.Topics = {
                                            RX: "topicRX_" + TrackerId,
                                            TX: "topicTX_" + TrackerId,
                                        }
                                        ToReturn.TrackerId = TrackerId
                                    }
                                    callback(ToReturn)
                                });
                            }
                        });
                    }
                })
            }
            else {
                ToReturn.error = ERROR_CODES.ErrorUserTokenIsInvalid // The provided token seams to be wrong so we return the error code.
                callback(ToReturn)
            }
        }
        
    });
}

function UpdateTrackerStatus(status, topic, callback) {
    ToReturn = new Object();
    ToReturn.error = ERROR_CODES.ErrorOK
    con.query("SELECT id FROM CredentialsTracker WHERE TopicRX='" + topic + "'", (err, result) => {
        if (err) {
            console.error(err)
            ToReturn.error = err
        }
        else {
            if (result[0] != undefined) {
                con.query("UPDATE Status_IOT SET status_charge = '" + status.charge + "',status_bat = '" + status.bat + "',status_alarm = '" + status.alarm + "',status_online = '" + 1 + "',status_ecomode = '" + status.eco_mode + "',status_protection = '" + status.protection + "',status_vh_charge = '" + status.veh_chg + "',status_gps = '" + status.gps + "' WHERE id_iot='" + result[0].id + "'", (err, result) => {
                    if (err) {
                        console.error(err)
                        ToReturn.error = err
                    }
                });
            }
            else {
                ToReturn.error = ERROR_CODES.ErrorMQTTTrackerUnavailable
            }
        }
        callback(ToReturn)
    });
}

function GetAllTrackersTopics(callback) {
    ToReturn = new Object();
    ToReturn.error = ERROR_CODES.ErrorOK
    con.query("SELECT * FROM CredentialsTracker", (err, result) => {
        if (err) {
            console.error(err)
            ToReturn.error = err
        }
        else {
            if (result[0] != undefined) {
                ToReturn.trackers = result
            }

            else {
                ToReturn.error = ERROR_CODES.ErrorUserHasNoTracker
            }
        }
        callback(ToReturn)
    });
}

function AddPositionOfTrackerToDb(pos, id, date, alarm, callback) {
    ToReturn = new Object();
    ToReturn.error = ERROR_CODES.ErrorOK
    var sql = "INSERT INTO Pos_IOT (lat, lon, id_iot,timestamp) VALUES ('" + pos.lat + "', '" + pos.lon + "', '" + id + "', '" + date + "')";
    var IDToRemove = ""
    con.query(sql, function (err, result) {
        if (err) {
            console.log(err)
            ToReturn.error = ERROR_CODES.ErrorSQLInjectError
            throw err
        }
        else {
            if(alarm == 0) {
                sql = "SELECT * FROM Pos_IOT WHERE id_iot = '" + id + "' ORDER BY id DESC LIMIT "+config.QuantityOfPosPerTracker; // This SQL request keep only the last n records in the database
                con.query(sql, function (err, result) {
                    if (err) {
                        ToReturn.error = ERROR_CODES.ErrorSQLInjectError
                        throw err
                    }
                    else {
                        for (let i = 0; i < result.length; i++) {
                            if (i != 0) {
                                IDToRemove = IDToRemove + ","
                            }
                            IDToRemove = IDToRemove + result[i].id
                        }
                        sql = "DELETE FROM Pos_IOT WHERE id NOT IN (" + IDToRemove + ") AND id_iot = '" + id + "'";
                        con.query(sql, function (err, result) {
                            if (err) {
                                ToReturn.error = ERROR_CODES.ErrorSQLDeleteError
                                throw err
                            }
                        });
                    }
                });
            }
        }
        callback(ToReturn)
    });
}

function GetTrackerSafezone(id, callback) {
    ToReturn = new Object();
    ToReturn.error = ERROR_CODES.ErrorOK
    con.query("SELECT safeZoneDiam, lonSfz, latSfz FROM CredentialsTracker WHERE id = '"+id+"'", (err, result) => {
        if (err) {
            console.error(err)
            ToReturn.error = err
        }
        else {
            if (result[0] != undefined) {
                ToReturn.safezone = new Object();
                ToReturn.safezone.lat = result[0].latSfz
                ToReturn.safezone.lon = result[0].lonSfz
                ToReturn.safezone.diameter = result[0].safeZoneDiam
            }

            else {
                ToReturn.error = ERROR_CODES.ErrorUserHasNoTracker
            }
        }
        callback(ToReturn)
    });
}

function SetTrackerSafezone(id,lat,lon, callback) {
    ToReturn = new Object();
    ToReturn.error = ERROR_CODES.ErrorOK
    con.query("UPDATE CredentialsTracker SET lonSfz = '"+lat+"', latSfz = '"+lon+"' WHERE id = '"+id+"'", (err, result) => {
        if (err) {
            console.error(err)
            ToReturn.error = err
        }
        else {
            if (result[0] != undefined) {
                ToReturn.lat = result[0].latSfz
                ToReturn.lon = result[0].lonSfz
                ToReturn.diameter = result[0].safeZoneDiam
            }

            else {
                ToReturn.error = ERROR_CODES.ErrorUserHasNoTracker
            }
        }
        callback(ToReturn)
    });
}

function AddRequestLog(request) {
    ToReturn = new Object();
    ToReturn.error = ERROR_CODES.ErrorOK
    con.query("INSERT INTO LogRq (description,timestamp) VALUES ('"+request+"','"+date.GetTimestamp()+"')", (err, result) => {
        if (err) {
            console.error(err)
        }
    });
}

function AddUserLogin(user) {
    ToReturn = new Object();
    ToReturn.error = ERROR_CODES.ErrorOK
    con.query("INSERT INTO logUser (id_user,timestamp) VALUES ('"+user+"','"+date.GetTimestamp()+"')", (err, result) => {
        if (err) {
            console.error(err)
        }
    });
}

module.exports = { // Export funtion for other file to use it.
    /**
     * Fetch the user information from the user auth token (id).
     * @param {(String)} token - The auth token of the user.
     * @param {Function} callback - The callback to trigger.
     */
    GetUserInformation: function (token, callback) {
        GetUserInformation(token, callback)
    },
    /**
     * Add a new user to the DB with provided informations.
     * @param {(String)} mail - The e-mail of the user.
     * @param {(String)} password - The hash password of the user.
     * @param {(String)} token - The auth token of the user.
     * @param {Function} callback - The callback to trigger.
     */
    AddUserToDb: function (mail, pass, token, callback) {
        AddUserToDb(mail, pass, token, callback)
    },
    /**
     * Fetch all data of a user from his mail.
     * @param {String} mail - The mail of the user
     * @param {Function} callback - The callback to trigger after checking credentials.
     */
    CheckUserCredentials: function (mail, callback) {
        CheckUserCredentials(mail, callback)
    },
    /**
     * Fetch all trackers of a user from his id and put it in an array (iotArray).
     * @param {(Int)} user_id - The unique id of the user.
     * @param {Function} callback - The callback to trigger.
     */
    GetUserTrackers: function (user_id, callback) {
        GetUserTrackers(user_id, callback)
    },
    /**
     * Fetch the position history of a tracker based on his unique id (history).
     * @param {(Int)} id_iot - The unique id of the tracker.
     * @param {Function} callback - The callback to trigger.
     */
    GetTrackerHistoryPosition: function (id_iot, callback) {
        GetTrackerHistoryPosition(id_iot, callback)
    },
    /**
     * Fetch all trackers status of a user from his token and put it in an array (status_list).
     * @param {(String)} token - The auth token of the user.
     * @param {Function} callback - The callback to trigger.
     */
    GetTrackersStatusList: function (token, callback) {
        GetTrackersStatusList(token, callback)
    },
    /**
     * Set the tracker status in the DB with his unique ID.
     * @param {(Int)} id_iot - The unique id of the tracker.
     * @param {(Bool)} status_alarm - If the alarm is ON/OFF.
     * @param {(Bool)} status_ecomode - If the ecomode is ON/OFF.
     * @param {(Bool)} status_protection - If the zone protection is ON/OFF.
     * @param {(Bool)} status_vh_charge - If the device is allowed to charge is ON/OFF.
     * @param {Function} callback - The callback to trigger.
     */
    SetTrackerStatus: function (id_iot, status_charge, status_bat, status_alarm, status_ecomode, status_protection, status_vh_charge, callback) {
        SetTrackerStatus(id_iot, status_charge, status_bat, status_alarm, status_ecomode, status_protection, status_vh_charge, callback)
    },
    /**
     * Update the tracker status in the DB.
     * @param {(TrackerStatus)} status - The status of the tracker.
     * @param {(String)} topic - The unique MQTT topic of the tracker.
     * @param {Function} callback - The callback to trigger.
     */
    UpdateTrackerStatus: function (status, topic, callback) {
        UpdateTrackerStatus(status, topic, callback)
    },
    /**
     * Add a new tracker to the DB and link it to an existing user.
     * @param {(String)} token - The auth token of the user.
     * @param {(String)} trackerName - The tracker name.
     * @param {Function} callback - The callback to trigger.
     */
    AddTrackerToUser: function (token, trackerName, password, callback) {
        AddTrackerToUser(token, trackerName, password, callback)
    },
    /**
     * Fetch all credentials off all the existing trackers from the DB.
     * @param {Function} callback - The callback to trigger.
     */
    GetAllTrackersTopics: function (callback) {
        GetAllTrackersTopics(callback)
    },
    /**
     * Fetch the last position of a tracker based on his unique ID (now).
     * @param {(Int)} id_iot - The unique id of the tracker.
     * @param {Function} callback - The callback to trigger.
     */
    GetTrackerLastPosition: function (id_iot, callback) {
        GetTrackerLastPosition(id_iot, callback)
    },
    /**
     * Fetch a tracker status from the DB from his unique MQTT topic (status).
     * @param {(String)} topic - The unique token of the tracker.
     * @param {Function} callback - The callback to trigger.
     */
    GetTrackerStatus: function (topic, callback) {
        GetTrackerStatus(topic, callback)
    },
    /**
     * Add a position of a tracker to the DB from his id.
     * @param {(Position)} pos - The position object.
     * @param {(Int)} id - The unique ID of the tracker.
     * @param {(Int)} date - The timestamp of the position.
     * @param {Function} callback - The callback to trigger adding the position.
     */
    AddPositionOfTrackerToDb: function (pos, id, date, alarm ,callback) {
        AddPositionOfTrackerToDb(pos, id, date, alarm,callback)
    },
    /**
     * Get the safezone of a tracker from his id.
     * @param {(Int)} id - The unique ID of the tracker.
     * @param {Function} callback - The callback to trigger after getting the Safezone.
     */
    GetTrackerSafezone: function (id, callback) {
        GetTrackerSafezone(id, callback)
    },
    /**
     * Set the safezone of a tracker from his id.
     * @param {(Int)} id - The unique ID of the tracker.
     * @param {(Float)} lat - The unique ID of the tracker.
     * @param {(Float)} lon - The unique ID of the tracker.
     * @param {Function} callback - The callback to trigger after getting the Safezone.
     */
    SetTrackerSafezone: function (id,lat,lon, callback) {
        SetTrackerSafezone(id,lat,lon, callback)
    },
    /**
     * Add request log.
     * @param {(String)} request - The description of the request.
     */
    AddRequestLog: function (request) {
        AddRequestLog(request)
    },
    /**
     * Add user log.
     * @param {(Int)} user - The user id who login.
     */
    AddUserLogin: function (user) {
        AddUserLogin(user)
    }
}
