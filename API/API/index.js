const fs = require('fs');
const path = require('path');
const config = require('./config.json')
const https = require('https'); // Required to use HTTPS for the REST API
const express = require('express'); // Required for the REST API to work.
const cors = require('cors')
const date = require('./date')
const encryption = require('./encryption')
const mysql = require('./mysql')
const mqtt = require('./mqtt')
var bcrypt = require('bcrypt');
const app = express() // Create the REST API
const key = fs.readFileSync(path.join(__dirname, config.Certificate.Certificate_folder, config.Certificate.Key));
const cert = fs.readFileSync(path.join(__dirname, config.Certificate.Certificate_folder, config.Certificate.Cert));
const ERROR_CODES = require('./error_codes').ERROR_CODES;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "*", // Allow Redirection for mobile Apps.
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'] // Allow all of this methods to all API endpoints.
}));

function DebugPrint(data) { // This function print data if config.Debug is set to true.
    if (config.Debug == true) {
        console.log("[" + date.GetDate() + "] [" + date.GetTime() + "] -> " + data)
    }
}

function HandlePositionActualRequest(req, res) { // [DUMMY]
    mqtt.RequestTrackerPosition(req.params.id,function(data) {
        res.status(200).json(data) // Reply with the json object.
    })
    
}

function HandleGetUserTrackers(req, res) { // Return tracker list of a user from his token [DONE]
    mysql.GetUserInformation(req.params.token, function (User) {
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
    DebugPrint("Received user information request for " + req.params.mail + " with password : " + req.params.password + ".")
    mysql.CheckUserCredentials(req.params.mail, function (UserCredentials) {
        if (UserCredentials.error.Code == 0) {
            UserCredentials.data.password = UserCredentials.data.password.replace('$2y$', '$2a$');
            if (bcrypt.compareSync(req.params.password, UserCredentials.data.password)) {
                res.status(200).json({error: ERROR_CODES.ErrorOK, user: UserCredentials.data.token}) // Reply with the json object.
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
    mqtt.RequestTrackerStatus(req.params.id_iot,function(data) {
        res.status(200).json(data) // Reply with the json object.
    })
}

function HandleUserAddRequest(req, res) { // Add user to DB if it dosen't exist.
    DebugPrint("Received add user request with the following mail and password : " + req.body.mail + " " + req.body.password)
    encryption.EncryptPassword(req.body.password, function (hash) {
        mysql.AddUserToDb(req.body.mail, hash, "I need to dev this shit but i dont have very envie", function (data) {
            res.status(200).json(data) // Reply with the json object.
        });
    })

}

function HandleGetTrackerPositionHistory(req, res) { // Return tracker position history, need to add security.
    mysql.GetTrackerPosition(req.params.id, function (data) {
        if (data.error.Code == 0) {

            res.status(200).json({ error: ERROR_CODES.ErrorOK, history: data.history }) // Reply with the json object.
        }
        else {

            res.status(200).json({ error: data.error }) // Reply with the json object.
        }
    })
}

function HandlerGetStatusList(req, res) { // Return all status from all trackers linked to a token [DONE]
    mysql.GetTrackersStatusList(req.params.token, function (data) {
        if (data.error.Code == 0) {
            res.status(200).json({ error: ERROR_CODES.ErrorOK, status_list: data.status_list })
        }
        else {
            res.status(200).json({ error: data.error }) // Reply with the json object.
        }
    })
}

function HandlerSetStatus(req, res) { // Set a tracker status [TODO]
    mysql.SetTrackerStatus(req.body.id_iot, req.body.status_alarm, req.body.status_ecomode, req.body.status_protection, req.body.status_vh_charge, function (data) {
        if (data.error.Code == 0) {
            res.status(200).json({ error: ERROR_CODES.ErrorOK })
        }
        else {
            res.status(200).json({ error: data.error }) // Reply with the json object.
        }
    })
}

function HandleTrackerAddRequest(req,res) { // Add a tracker to a user based on his token.
    mysql.AddTrackerToUser(req.body.token,req.body.name, function(data) {
        res.status(200).json(data) // Reply with the json object.
    })
}

const Server = https.createServer({ key, cert }, app).listen(config.Server_Port, () => { // Create secure HTTPS REST API
    DebugPrint("Server started and ready to respond.")
})

app.get('/', (req, res) => { // Redirect '/' to web interface. [DONE]
    res.redirect('https://ovl.tech-user.fr:7070/') // Redirect to le Z web interface.
})

app.get('/user/:mail/:password', function (req, res) { // Endpoint to get the token of the user.
    HandleUserInfoRequest(req, res)
})

app.get('/status/:id_iot/', (req, res) => { // Get Status
    HandleStatusRequest(req, res)
})

app.post('/user/', (req, res) => { // Endpoint to add a user. [DONE]
    HandleUserAddRequest(req, res)
})

app.post('/iot/', (req, res) => { // Endpoint to add a iot. [DONE]
    HandleTrackerAddRequest(req, res)
})

app.get('/iot_list/:token/', (req, res) => { // Endpoint used to get the list of trackers from a user token. [DONE]
    HandleGetUserTrackers(req, res);
})

app.get('/test/position/history/:id/', (req, res) => { // Endpoint used to position history of a tracker from his id. [DONE]
    HandleGetTrackerPositionHistory(req, res)
})

app.get('/test/status_list/:token/', (req, res) => { // Return a user tracker list.
    HandlerGetStatusList(req, res)
})

app.put('/set/status/', (res, req) => { // Endpoint used to set tracker status. [TOFINISH]
    HandlerSetStatus(res, req)
})

/*
########################################################################################################################
########################################################################################################################
########################################################################################################################
##############################################      BELOW IS DUMMY API      ############################################
########################################################################################################################
########################################################################################################################
########################################################################################################################
*/

app.get('/position/now/:id', (req, res) => { // Endpoint to get the actual position of a tracker based on his ID. [TODO]
    HandlePositionActualRequest(req, res) // Trigger the Position request.
})

app.get('/test/users/:email/:password', (req, res) => {
    ToReturn = new Object();
    ToReturn.error = ERROR_CODES.ErrorOK; // Storing the ErrorJson object template in the ToReturn json object.
    mysql.CheckUserCredentials(req.params.email, function (data) {
        if (data.error.Code == 0) {
            data.data.password = data.data.password.replace('$2y$', '$2a$');
            if (bcrypt.compareSync(req.params.password, data.data.password)) {
                res.status(200).json({ error: ERROR_CODES.ErrorOK, token: data.data.token });
            }
            else {
                data.error = ERROR_CODES.ErrorUserWrongCredentials
                data.data = undefined
                res.status(200).json(data);
            }
        }
        else {
            ToReturn.error = data.error
            res.status(200).json(ToReturn); // Reply with the error json object.
        }
    });

})

