/**
 * @module Index
 * @description This is the main module, it contain all the API Enpoints.
*/
const fs = require('fs');
const path = require('path');
const config = require('./config'); // Load config file.
const https = require('https'); // Required to use HTTPS for the REST API
const express = require('express'); // Required for the REST API to work.
const cors = require('cors') // Needed to sertup REST API for mobile use.
const debug = require('./debug') // Debug function.
const api_handler = require('./API_Handler');
const { ERROR_CODES } = require('./error_codes');
const discord = require('./discord');
const app = express() // Create the REST API
const privateKey = fs.readFileSync(config.Certificate.privateKey, 'utf8');
const certificate = fs.readFileSync(config.Certificate.certificate, 'utf8');
const ca = fs.readFileSync(config.Certificate.ca, 'utf8');
const credentials = { // Load certficate for SSL needs.
  key: privateKey,
  cert: certificate,
  ca: ca
};
const rateLimit = require('express-rate-limit'); // Need to avoid API spam and crash.
const APILimit = rateLimit({
	windowMs: 1000, // 1s
	max: 400, // Limit each IP to 400 requests per `window` (here, per second)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})
const loginLimit = rateLimit({
	windowMs: 1000,
	max: 1,
	message:
		'Too many request to login, please wait and retry !',
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})
app.use(APILimit) // Apply the rate limiting middleware to all requests
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
const Server = https.createServer(credentials, app).listen(config.Server_Port, () => { // Create secure HTTPS REST API
    debug.Print("Server started and ready to respond.")
    discord.SendSucesssWebhook("API","REST API Status","Server started and ready to respond.")
})
/**
 * The root GET endpoint is used to redirect to the web interface.
 */
const GET_Endpoint_ROOT = app.get('/', (req, res) => { // Redirect '/' to web interface. [DONE]
    res.redirect(config.AdministrationURL) // Redirect to le Z web interface.
})
/**
 * This GET endpoint take a mail and a password : `/user/:mail/:password`.
 */
const GET_Endpoint_HandleUserInfoRequest = app.get('/user/:mail/:password',loginLimit, function (req, res) { // Endpoint to get the token of the user. [NEED ADD TOKEN]
    debug.Print("Received request on "+req.headers.host+req.url+"\n"+"GET Request   [HandleUserInfoRequest]")
    api_handler.HandleUserInfoRequest(req, res)
})
/**
 * This GET endpoint take the unique ID of the tracker : `/status/:id_iot/`.
 */
const GET_Endpoint_HandleStatusRequest = app.get('/status/:id_iot/', (req, res) => { // Get Status
    debug.Print("Received request on "+req.headers.host+req.url+"\n"+"GET Request [HandleStatusRequest]")
    api_handler.HandleStatusRequest(req, res)
})
/**
 * This GET endpoint take the auth token of the user : `/iot_list/:token/`.
 */
const GET_Endpoint_HandleGetUserTrackers = app.get('/iot_list/:token/', (req, res) => { // Endpoint used to get the list of trackers from a user token. [DONE]
    debug.Print("Received request on "+req.headers.host+req.url+"\n"+"GET Request [HandleGetUserTrackers]")
    api_handler.HandleGetUserTrackers(req, res);
})
/**
 * This GET endpoint take the auth token of the user : `/status_list/:token/` and return all trackers status of the user.
 */
const GET_Endpoint_HandleGetStatusList = app.get('/status_list/:token/', (req, res) => { // Return a user tracker list.
    debug.Print("Received request on "+req.headers.host+req.url+"\n"+"GET Request [HandleGetStatusList]")
    api_handler.HandleGetStatusList(req, res)
})
/**
 * This GET endpoint take the unique ID of the tracker : `/position/now/:id` and return a `Position` Object.
 */
const GET_Endpoint_HandleGetTrackerPositionActual = app.get('/position/now/:id', (req, res) => { // Endpoint to get the actual position of a tracker based on his ID. [TODO]
    debug.Print("Received request on "+req.headers.host+req.url+"\n"+"GET Request [HandleGetTrackerPositionActual]")
    api_handler.HandleGetTrackerPositionActual(req, res) // Trigger the Position request.
})
/**
 * This GET endpoint take the unique ID of the tracker : `/position/history/:id/` and return an Array of `Position` Object.
 */
const GET_Endpoint_HandleGetTrackerPositionHistory = app.get('/position/history/:id/', (req, res) => { // Endpoint used to position history of a tracker from his id. [DONE]
    debug.Print("Received request on "+req.headers.host+req.url+"\n"+"GET Request [HandleGetTrackerPositionHistory]")
    api_handler.HandleGetTrackerPositionHistory(req, res)
})
/**
 * This GET endpoint take the unique ID of the tracker : `/position/safezone/:id/` and return lat lon and diameter of the Safezone.
 */
const GET_Endpoint_HandleGetSafezone = app.get('/position/safezone/:id/', (req, res) => { // Endpoint used to position history of a tracker from his id. [DONE]
    debug.Print("Received request on "+req.headers.host+req.url+"\n"+"GET Request [HandleGetTrackerHandleGetSafezone]")
    api_handler.HandleGetTrackerSafezonePosition(req, res)
})
/**
 * This GET endpoint take the unique ID of the tracker : `/position/gpx/:id/` and return the tarcker GPX file.
 */
const GET_Endpoint_HandleGetGPX= app.get('/position/gpx/:id/:trackername', (req, res) => { // Endpoint used to get GPX file of a tracker from his id. [TODO]
    debug.Print("Received request on "+req.headers.host+req.url+"\n"+"GET Request [HandleGetGPX]")
    api_handler.HandleGetTrackerPositionGPX(req, res)
})
/**
 * This POST endpoint add a new user to the database.
 */
const POST_Endpoint_HandleUserAddRequest = app.post('/user/', (req, res) => { // Endpoint to add a user. [DONE]
    debug.Print("Received request on "+req.headers.host+req.url+"\n"+"POST Request [HandleUserAddRequest]")
    api_handler.HandleUserAddRequest(req,res)
})
/**
 * This POST endpoint add a new tracker in the database.
 */
const POST_Endpoint_HandleTrackerAddRequest = app.post('/iot/', (req, res) => { // Endpoint to add a iot. [DONE]
    debug.Print("Received request on "+req.headers.host+req.url+"\n"+"POST Request [HandleTrackerAddRequest]")
    api_handler.HandleTrackerAddRequest(req,res)
})
/**
 * This PUT endpoint set the status of the tarcker in the DB.
 */
const PUT_Endpoint_HandleSetStatus = app.put('/set/status/', (req, res) => { // Endpoint used to set tracker status. [DONE]
    debug.Print("Received request on "+req.headers.host+req.url+"\n"+"PUT Request [HandleSetStatus]")
    api_handler.HandleSetStatus(req, res)
})
const Lazy_GET_Endpoint_ROOT = app.get('/lazy/', (req, res) => { // Redirect '/lazy/' to web interface. [DONE]
    res.redirect('https://ovl.tech-user.fr:7070/') // Redirect to le Z web interface.
})
/**
 * Lazy endpoint for our Web developper.
 */
const Lazy_GET_Endpoint_HandleUserInfoRequest = app.get('/lazy/user/:mail/:password', function (req, res) { // Endpoint to get the token of the user. [NEED ADD TOKEN]
    debug.Print("Received request on "+req.headers.host+req.url+"\n"+"GET Request [HandleUserInfoRequest]")
    res.status(200).json({token: "SQDqsd416qsd4qs5dqfqsdqsd",error: ERROR_CODES.ErrorOK})
})
/**
 * Lazy endpoint for our Web developper.
 */
const Lazy_GET_Endpoint_HandleStatusRequest = app.get('/lazy/status/:id_iot/', (req, res) => { // Get Status
    debug.Print("Received request on "+req.headers.host+req.url+"\n"+"GET Request [HandleStatusRequest]")
    res.status(200).json({status: {bat: 100, charge: true, vehiclechg: true, protection: true, ecomode: true, alarm: true, gps: true},error: ERROR_CODES.ErrorOK})
})
/**
 * Lazy endpoint for our Web developper.
 */
const Lazy_GET_Endpoint_HandleGetUserTrackers = app.get('/lazy/iot_list/:token/', (req, res) => { // Endpoint used to get the list of trackers from a user token. [DONE]
    debug.Print("Received request on "+req.headers.host+req.url+"\n"+"GET Request [HandleGetUserTrackers]")
    res.status(200).json({trackers: [{name:"C15 1.1 E", id: 0},{name:"Dadia 1.5 DCI", id: 1}],user: "dev@ovl.tech-user.fr",error: ERROR_CODES.ErrorOK})
})
/**
 * Lazy endpoint for our Web developper.
 */
const Lazy_GET_Endpoint_HandleGetStatusList = app.get('/lazy/status_list/:token/', (req, res) => { // Return a user tracker list.
    debug.Print("Received request on "+req.headers.host+req.url+"\n"+"GET Request [HandleGetStatusList]")
    res.status(200).json({status_list: [{bat: 100, charge: true, vehiclechg: true, protection: true, ecomode: true, alarm: true, gps: true},{bat: 10, charge: false, vehiclechg: false, protection: false, ecomode: false, alarm: false, gps: false}],error: ERROR_CODES.ErrorOK})
})
/**
 * Lazy endpoint for our Web developper.
 */
const Lazy_GET_Endpoint_HandleGetTrackerPositionActual = app.get('/lazy/position/now/:id', (req, res) => { // Endpoint to get the actual position of a tracker based on his ID. [TODO]
    debug.Print("Received request on "+req.headers.host+req.url+"\n"+"GET Request [HandleGetTrackerPositionActual]")
    res.status(200).json({position: {lat: 15.0, lon: 0.0, timestamp: 1000217640},error: ERROR_CODES.ErrorOK})
})
/**
 * Lazy endpoint for our Web developper.
 */
const Lazy_GET_Endpoint_HandleGetTrackerPositionHistory = app.get('/lazy/position/history/:id/', (req, res) => { // Endpoint used to position history of a tracker from his id. [DONE]
    debug.Print("Received request on "+req.headers.host+req.url+"\n"+"GET Request [HandleGetTrackerPositionHistory]")
    res.status(200).json({history: [{lat: 0.0, lon: 15.0, timestamp: 1000217640},{lat: 15.0, lon: 0.0, timestamp: 1000217640}],error: ERROR_CODES.ErrorOK})
})
/**
 * Lazy endpoint for our Web developper.
 */
const Lazy_POST_Endpoint_HandleUserAddRequest = app.post('/lazy/user/', (req, res) => { // Endpoint to add a user. [DONE]
    debug.Print("Received request on "+req.headers.host+req.url+"\n"+"POST Request [HandleUserAddRequest]")
    res.status(200).json({Topics:  {"topicTX": "topicTX_0", "topicRX": "topicRX_0"},TrackerId: 0,error: ERROR_CODES.ErrorOK})
})
/**
 * Lazy endpoint for our Web developper.
 */
const Lazy_POST_Endpoint_HandleTrackerAddRequest = app.post('/lazy/iot/', (req, res) => { // Endpoint to add a iot. [DONE]
    debug.Print("Received request on "+req.headers.host+req.url+"\n"+"POST Request [HandleTrackerAddRequest]")
    res.status(200).json({error: ERROR_CODES.ErrorOK})
})
/**
 * Lazy endpoint for our Web developper.
 */
const Lazy_PUT_Endpoint_HandleSetStatus = app.put('/lazy/set/status/', (req, res) => { // Endpoint used to set tracker status. [TOFINISH]
    debug.Print("Received request on "+req.headers.host+req.url+"\n"+"PUT Request [HandleSetStatus]")
    res.status(200).json({error: ERROR_CODES.ErrorOK})
})
/**
 * Lazy endpoint for our Web developper.
 */
const Lazy_GET_Endpoint_HandleGetSafezone = app.get('/lazy/position/safezone/:id/', (req, res) => { // Endpoint used to position history of a tracker from his id. [DONE]
    debug.Print("Received request on "+req.headers.host+req.url+"\n"+"GET Request [HandleGetTrackerHandleGetSafezone]")
    res.status(200).json({safezone: {lat: 0.0, lon: 15.0},error: ERROR_CODES.ErrorOK})
})
