/**
 * @module Index
 * @description This is the main module, it contain all the API Enpoints.
*/
const fs = require('fs');
const path = require('path');
const config = require('./config') // Load config file.
const https = require('https'); // Required to use HTTPS for the REST API
const express = require('express'); // Required for the REST API to work.
const cors = require('cors') // Needed to sertup REST API for mobile use.
const debug = require('./debug') // Debug function.
const api_handler = require('./API_Handler')
const app = express() // Create the REST API
const key = fs.readFileSync(path.join(__dirname, config.Certificate.Certificate_folder, config.Certificate.Key));
const cert = fs.readFileSync(path.join(__dirname, config.Certificate.Certificate_folder, config.Certificate.Cert));

app.use(express.json()); // Needed for the json format response.
app.use(express.urlencoded({ extended: true })); // Allow urlencode parameters.
/**
 * Setup the security for the REST API
 * @param {(String)} origin - All domain allowed to use the API.
 * @param {(String)} methods - All the methods allowed to be called with the API.
 */
app.use(cors({ // This setup the REST API
    origin: "*", // Allow Redirection for mobile Apps.
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'] // Allow all of this methods to all API endpoints.
}));

/**
 * Create the REST API Server, listen on port setup in `config.Server_Port`.
 */
const Server = https.createServer({ key, cert }, app).listen(config.Server_Port, () => { // Create secure HTTPS REST API
    debug.Print("Server started and ready to respond.")
})

/**
 * The root GET endpoint is used to redirect to the web interface.
 */
const GET_Endpoint_ROOT = app.get('/', (req, res) => { // Redirect '/' to web interface. [DONE]
    res.redirect('https://ovl.tech-user.fr:7070/') // Redirect to le Z web interface.
})
/**
 * This GET endpoint take a mail and a password : `/user/:mail/:password`.
 */
const GET_Endpoint_HandleUserInfoRequest = app.get('/user/:mail/:password', function (req, res) { // Endpoint to get the token of the user. [NEED ADD TOKEN]
    api_handler.HandleUserInfoRequest(req, res)
})
/**
 * This GET endpoint take the unique ID of the tracker : `/status/:id_iot/`.
 */
const GET_Endpoint_HandleStatusRequest = app.get('/status/:id_iot/', (req, res) => { // Get Status
    api_handler.HandleStatusRequest(req, res)
})
/**
 * This GET endpoint take the auth token of the user : `/iot_list/:token/`.
 */
const GET_Endpoint_HandleGetUserTrackers = app.get('/iot_list/:token/', (req, res) => { // Endpoint used to get the list of trackers from a user token. [DONE]
    api_handler.HandleGetUserTrackers(req, res);
})
/**
 * This GET endpoint take the auth token of the user : `/status_list/:token/` and return all trackers status of the user.
 */
const GET_Endpoint_HandleGetStatusList = app.get('/status_list/:token/', (req, res) => { // Return a user tracker list.
    api_handler.HandleGetStatusList(req, res)
})
/**
 * This GET endpoint take the unique ID of the tracker : `/position/now/:id` and return a `Position` Object.
 */
const GET_Endpoint_HandleGetTrackerPositionActual = app.get('/position/now/:id', (req, res) => { // Endpoint to get the actual position of a tracker based on his ID. [TODO]
    api_handler.HandleGetTrackerPositionActual(req, res) // Trigger the Position request.
})
/**
 * This GET endpoint take the unique ID of the tracker : `/position/history/:id/` and return an Array of `Position` Object.
 */
const GET_Endpoint_HandleGetTrackerPositionHistory = app.get('/position/history/:id/', (req, res) => { // Endpoint used to position history of a tracker from his id. [DONE]
    api_handler.HandleGetTrackerPositionHistory(req, res)
})
/**
 * This POST endpoint take the mail and the password of the new user (req.body.mail, req.body.password) : `/user/` and return an `Error` Object.
 */
const POST_Endpoint_HandleUserAddRequest = app.post('/user/', (req, res) => { // Endpoint to add a user. [DONE]
    api_handler.HandleUserAddRequest(req, res)
})
/**
 * This POST endpoint take the auth token of the user and the name of the new tracker (req.body.token, req.body.name) : `/iot/` and return a `Topics` Object and the ID of the Tracker.
 */
const POST_Endpoint_HandleTrackerAddRequest = app.post('/iot/', (req, res) => { // Endpoint to add a iot. [DONE]
    api_handler.HandleTrackerAddRequest(req, res)
})
/**
 * This PUT endpoint take all the status fields for a tracker (req.body.id_iot, req.body.status_alarm, req.body.status_ecomode, req.body.status_protection, req.body.status_vh_charge) : `/set/status/` and return a `Error` Object.
 */
const PUT_Endpoint_HandleSetStatus = app.put('/set/status/', (res, req) => { // Endpoint used to set tracker status. [TOFINISH]
    api_handler.HandleSetStatus(res, req)
})