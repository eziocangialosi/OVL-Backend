/**
 * @module API_Handler
 * @description This module contains all the handlers for all the REST API endpoints.
 * @example <caption>Use this module from another file.</caption>
 * const api_handler = require('./API_Handler')
*/
const mysql = require('./mysql')
const mqtt = require('./mqtt')
var bcrypt = require('bcrypt');
const encryption = require('./encryption')
const ERROR_CODES = require('./error_codes').ERROR_CODES;
const debug = require('./debug') // Debug function.
const logs = require('./logs')

function HandleGetTrackerPositionActual(req, res) { // [DONE]
    logs.LogRequest("Request for position of the tracker with the id "+req.params.id)
    mqtt.RequestTrackerPosition(req.params.id, function (data) {
        res.status(200).json(data) // Reply with the json object.
    })
}

function HandleGetUserTrackers(req, res) { // Return tracker list of a user from his token [DONE]
    logs.LogRequest("Request for tracker list of the user with auth token "+req.params.token)
    mysql.GetUserInformationFromToken(req.params.token, function (User) {
        if (User.error.Code == 0) {
            mysql.GetUserTrackers(User.id, function (UserTrackers) {
                if (UserTrackers.error.Code == 0) {
                    res.status(200).json({ error: ERROR_CODES.ErrorOK, user: req.params.token, trackers: UserTrackers }) // Reply with the json object.
                }
                else {
                    res.status(200).json({ error: UserTrackers.error, user: req.params.token, trackers: UserTrackers }) // Reply with the json object.
                }
            });
        }
        else {
            res.status(200).json({ error: User.error }) // Reply with the json object.
        }
    })
}

function HandleUserInfoRequest(req, res) { // Return User info if mail and password good. [DONE]
    logs.LogRequest("Login request for "+req.params.mail)
    mysql.CheckUserCredentials(req.params.mail, function (UserCredentials) {
        if (UserCredentials.error.Code == 0) {
            UserCredentials.data.password = UserCredentials.data.password.replace('$2y$', '$2a$');
            if (bcrypt.compareSync(req.params.password, UserCredentials.data.password)) {
                logs.LogUserLogin(UserCredentials.data.id)
                res.status(200).json({ error: ERROR_CODES.ErrorOK, user: UserCredentials.data.token }) // Reply with the json object.
            }
            else {
                UserCredentials.error = ERROR_CODES.ErrorUserWrongCredentials
                UserCredentials.data = undefined
                res.status(200).json(UserCredentials);
            }
        }
        else {
            res.status(200).json({ error: UserCredentials.error });
        }
    });
}

function HandleStatusRequest(req, res) { //
    logs.LogRequest("Status request for tracker with id "+req.params.id_iot)
    mqtt.RequestTrackerStatus(req.params.id_iot, function (data) {
        res.status(200).json(data) // Reply with the json object.
    })
}

function HandleUserAddRequest(req, res) { // Add user to DB if it dosen't exist.
    logs.LogRequest("Add user request with  "+req.body.mail)
    encryption.EncryptPassword(req.body.password, function (hash) {
        mysql.AddUserToDb(req.body.mail, hash, encryption.randomStringAsBase64Url(20), function (data) {
            res.status(200).json(data) // Reply with the json object.
        });
    })
}

function HandleGetTrackerPositionHistory(req, res) { // Return tracker position history, need to add security.
    logs.LogRequest("Tracker position history request for tracker with id "+req.params.id)
    mysql.GetTrackerHistoryPosition(req.params.id, function (data) {
        if (data.error.Code == 0) {
            res.status(200).json({ error: ERROR_CODES.ErrorOK, history: data.history }) // Reply with the json object.
        }
        else {
            res.status(200).json({ error: data.error }) // Reply with the json object.
        }
    })
}

function HandleGetTrackerSafezonePosition(req, res) { // Return tracker safezone.
    logs.LogRequest("Tracker SafeZone request for tracker with id "+req.params.id)
    mysql.GetTrackerSafezone(req.params.id, function (data) {
        res.status(200).json(data) // Reply with the json object.
    })
}

function HandleGetStatusList(req, res) { // Return all status from all trackers linked to a token [DONE]
    logs.LogRequest("Trackers status list request for user with token "+req.params.token)
    mysql.GetTrackersStatusList(req.params.token, function (data) {
        if (data.error.Code == 0) {
            res.status(200).json({ error: ERROR_CODES.ErrorOK, status_list: data.status_list })
        }
        else {
            res.status(200).json({ error: data.error }) // Reply with the json object.
        }
    })
}

function HandleSetStatus(req, res) { // Set a tracker status [TODO]
    mysql.SetTrackerStatus(req.body.id_iot, req.body.status_ecomode, req.body.status_protection, req.body.status_vh_charge, function (data) {
        if(data.error.Code == 0) {
            //logs.LogRequest("Tracker status updated in DB for tracker "+req.body.id_iot)
            debug.Print("Updated status in DB for id " + req.body.id_iot)
            mqtt.UpdateTrackerStatus(req.body.id_iot, req.body.status_ecomode, req.body.status_protection, req.body.status_vh_charge)
        }
        else {
            debug.Print("Failed to update status in DB for id " + req.body.id_iot)
            console.log(data.error)
        }
        res.status(200).json({ error: data.error }) // Reply with the json object.
    })
}

function HandleTrackerAddRequest(req, res) { // Add a tracker to a user based on his token.
    logs.LogRequest("Tracker add request for user  "+req.body.token)
    const password = encryption.randomStringAsBase64Url(16);
    mysql.AddTrackerToUser(req.body.token, req.body.name,password, function (data) {
        mqtt.AddTracker(data.TrackerId, req.body.name, data.Topics.RX, data.Topics.TX,password)
        res.status(200).json(data) // Reply with the json object.
    })
}

module.exports = { // Export function for other file to use it.
    /**
    * Handle a request for the actual position of a tracker
    * @param {(Object)} req - Request object of the API CALL.
    * @param {(Object)} res - Response object of the API CALL.
    * @returns {(HandleGetTrackerPositionActual_data)} - `Position` Object that contain GPS coords and `Error` Oject.
    */
    HandleGetTrackerPositionActual: function (req, res) {
        HandleGetTrackerPositionActual(req, res)
    },
    /**
    * Handle a request for a user trackers array. 
    * @param {(Object)} req - Request object of the API CALL.
    * @param {(Object)} res - Response object of the API CALL.
    * @returns {(HandleGetUserTrackers_data)} - Array of `Tracker` Object that contain ID and Tracker's name and `Error` Oject.
    */
    HandleGetUserTrackers: function (req, res) {
        HandleGetUserTrackers(req, res)
    },
    /**
    * Handle a user informations request 
    * @param {(Object)} req - Request object of the API CALL.
    * @param {(Object)} res - Response object of the API CALL.
    * @returns {(HandleUserInfoRequest_data)} - The user auth token and the `Error` Oject.
    */
    HandleUserInfoRequest: function (req, res) {
        HandleUserInfoRequest(req, res)
    },
    /**
    * Handle a tracker status request from his ID.
    * @param {(Object)} req - Request object of the API CALL.
    * @param {(Object)} res - Response object of the API CALL.
    * @returns {(HandleStatusRequest_data)} - `Tracker` Object, and `Error` Object.
    */
    HandleStatusRequest: function (req, res) {
        HandleStatusRequest(req, res)
    },
    /**
    * Handle a add user request.
    * @param {(Object)} req - Request object of the API CALL.
    * @param {(Object)} res - Response object of the API CALL.
    * @returns {(Error)} - `Error` Object.
    */
    HandleUserAddRequest: function (req, res) {
        HandleUserAddRequest(req, res)
    },
    /**
    * Handle a request for history of position of a tracker
    * @param {(Object)} req - Request object of the API CALL.
    * @param {(Object)} res - Response object of the API CALL.
    * @returns {(HandleGetTrackerPositionHistory_data)} - Array of `Position` GPS coords and `Error` Object
    */
    HandleGetTrackerPositionHistory: function (req, res) {
        HandleGetTrackerPositionHistory(req, res)
    },
    /**
    * Handle a request for the safezone of a tracker
    * @param {(Object)} req - Request object of the API CALL.
    * @param {(Object)} res - Response object of the API CALL.
    * @returns {(HandleGetTrackerSafeZone_data)} - Array of `Position` GPS coords and `Error` Object
    */
    HandleGetTrackerSafezonePosition: function (req, res) {
        HandleGetTrackerSafezonePosition(req, res)
    },
    /**
    * Handle a for all tracker's status of a user.
    * @param {(Object)} req - Request object of the API CALL.
    * @param {(Object)} res - Response object of the API CALL.
    * @returns {(HandleGetStatusList_data)} - Array of `TrackerStatus` and `Error` Object.
    */
    HandleGetStatusList: function (req, res) {
        HandleGetStatusList(req, res)
    },
    /**
    * Handle a request to set the status of a tracker.
    * @param {(Object)} req - Request object of the API CALL.
    * @param {(Object)} res - Response object of the API CALL.
    * @returns {(Error)} - `Error` Object.
    */
    HandleSetStatus: function (req, res) {
        HandleSetStatus(req, res)
    },
    /**
    * Handle a request to add a tracker to a user.
    * @param {(Object)} req - Request object of the API CALL.
    * @param {(Object)} res - Response object of the API CALL.
    * @returns {(HandleTrackerAddRequest_data)} - ID of the tracker and MQTT Topics + `Error` Object.
    */
    HandleTrackerAddRequest: function (req, res) {
        HandleTrackerAddRequest(req, res)
    },
}