const fs = require('fs');
const path = require('path');
const config = require('./config.json') // Load config file.
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
app.use(cors({ // This setup the REST API
    origin: "*", // Allow Redirection for mobile Apps.
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'] // Allow all of this methods to all API endpoints.
}));

const Server = https.createServer({ key, cert }, app).listen(config.Server_Port, () => { // Create secure HTTPS REST API
    debug.Print("Server started and ready to respond.")
})

app.get('/', (req, res) => { // Redirect '/' to web interface. [DONE]
    res.redirect('https://ovl.tech-user.fr:7070/') // Redirect to le Z web interface.
})

app.get('/user/:mail/:password', function (req, res) { // Endpoint to get the token of the user. [NEED ADD TOKEN]
    api_handler.HandleUserInfoRequest(req, res)
})

app.get('/status/:id_iot/', (req, res) => { // Get Status
    api_handler.HandleStatusRequest(req, res)
})

app.get('/iot_list/:token/', (req, res) => { // Endpoint used to get the list of trackers from a user token. [DONE]
    api_handler.HandleGetUserTrackers(req, res);
})

app.get('/status_list/:token/', (req, res) => { // Return a user tracker list.
    api_handler.HandlerGetStatusList(req, res)
})

app.get('/position/now/:id', (req, res) => { // Endpoint to get the actual position of a tracker based on his ID. [TODO]
    api_handler.HandlePositionActualRequest(req, res) // Trigger the Position request.
})

app.get('/position/history/:id/', (req, res) => { // Endpoint used to position history of a tracker from his id. [DONE]
    api_handler.HandleGetTrackerPositionHistory(req, res)
})

app.post('/user/', (req, res) => { // Endpoint to add a user. [DONE]
    api_handler.HandleUserAddRequest(req, res)
})

app.post('/iot/', (req, res) => { // Endpoint to add a iot. [DONE]
    api_handler.HandleTrackerAddRequest(req, res)
})

app.put('/set/status/', (res, req) => { // Endpoint used to set tracker status. [TOFINISH]
    api_handler.HandlerSetStatus(res, req)
})