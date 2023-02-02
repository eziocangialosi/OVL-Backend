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
//const salt = bcrypt.genSaltSync(10);
var bcrypt = require('bcrypt');
const app = express() // Create the REST API
const key = fs.readFileSync(path.join(__dirname, config.Certificate.Certificate_folder, config.Certificate.Key));
const cert = fs.readFileSync(path.join(__dirname, config.Certificate.Certificate_folder, config.Certificate.Cert));
const ERROR_CODES = require('./error_codes').ERROR_CODES;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({origin: '*'}));
function DebugPrint(data) { // THIS DEBUG PRINT.
    if(config.Debug == true)
    {
        console.log("["+date.GetDate()+"] ["+date.GetTime()+"] -> "+data)
    }
}

function HandlePositionActualRequest(req,res) {
    let ToReturn = new Object() // Create the return json object.
    DebugPrint("Received actual position request for "+req.params.id+".")
    ToReturn.error = ERROR_CODES.ErrorOK // Storing the ErrorJson ocject template in the ToReturn json object.
    ToReturn.now = new Object() // Creating the json now object. 
    ToReturn.now.posx = 9.56454654 // Setting PosX of the tracker in the object.
    ToReturn.now.posy = 15.56454654 // Setting PosY of the tracker in the object.
    res.status(200).json(ToReturn) // Reply with the json object.
}

function HandleGetUserTrackers(req,res) { // Return tracker list of a user from his token
    mysql.GetUserInformation(req.params.token,function(User) {
        if(User.error.Code == 0){
            mysql.GetUserTrackers(User.id,function(UserTrackers) {
                if(UserTrackers.error.Code == 0)
                {
                    res.status(200).json({error : ERROR_CODES.ErrorOK, user : req.params.token, trackers : UserTrackers}) // Reply with the json object.
                }
                else
                {
                    res.status(200).json({error : UserTrackers.error, user : req.params.token, trackers : UserTrackers}) // Reply with the json object.
                }
            });
        }
        else{

            res.status(200).json({error : User.error}) // Reply with the json object.
        }
    })
   
}

function HandleUserInfoRequest(req,res) { // Return User info if mail and password good.
    DebugPrint("Received user information request for "+req.params.mail+" with password : "+req.params.password+".")
    mysql.CheckUserCredentials(req.params.mail,function(UserCredentials) {
        if(UserCredentials.error.Code == 0)
        {
            UserCredentials.data.password = UserCredentials.data.password.replace('$2y$', '$2a$');
            if(bcrypt.compareSync(req.params.password,UserCredentials.data.password))
            {
                res.status(200).json({user : UserCredentials.data.token}) // Reply with the json object.
            }
            else
            {
                UserCredentials.error = ERROR_CODES.ErrorUserWrongCredentials
                UserCredentials.data = undefined
                res.status(200).json(UserCredentials);
            }  
        }
        else
        {
            res.status(200).json({error:UserCredentials.error});
        }
    });
}

function HandleStatusRequest(req,res) { // DUMMY
    let ToReturn = new Object() // Create the return json object.
    DebugPrint("Received status request.")
    ToReturn.error = ERROR_CODES.ErrorOK // Storing the ErrorJson object template in the ToReturn json object.
    ToReturn.status = new Object() // Create the status json object.
    ToReturn.status.errors = 0
    ToReturn.status.battery_state = 100
    ToReturn.status.alarm = false
    res.status(200).json(ToReturn) // Reply with the json object.
}

function HandleUserAddRequest(req,res) { // Add user to DB if it dosen't exist.
    DebugPrint("Received add user request with the following mail and password : "+req.body.mail+" "+req.body.password)
    encryption.EncryptPassword(req.body.password,function(hash)
    {
        mysql.AddUserToDb(req.body.mail,hash,"I need to dev this shit but i dont have very envie",function(data) {
            res.status(200).json(data) // Reply with the json object.
        });
    })
    
}

function HandleGetTrackerPositionHistory(req,res) { // Return tracker position history, need to add security.
    mysql.GetTrackerPosition(req.params.id,function(data)
    {
        if(data.error.Code == 0){
            
            res.status(200).json({error : ERROR_CODES.ErrorOK, history : data.history}) // Reply with the json object.
        }
        else{

            res.status(200).json({error : data.error}) // Reply with the json object.
        }
    })
}

function HandlerGetStatusList(req,res) {
    mysql.GetTrackersStatusList(req.params.token,function(data) {
        if(data.error.Code == 0){
            res.status(200).json({error : ERROR_CODES.ErrorOK, status_list : data.status_list})
        }
        else{
            res.status(200).json({error : data.error}) // Reply with the json object.
        }
    })
}

function HandlerSetStatus(req,res) {
    mysql.SetTrackerStatus(req.body.id_iot,req.body.status_charge,req.body.status_bat,req.body.status_alarm,req.body.status_ecomode,req.body.status_protection,req.body.status_vh_charge,function(data){
        if(data.error.Code == 0){
            res.status(200).json({error : ERROR_CODES.ErrorOK})
        }
        else{
            res.status(200).json({error : data.error}) // Reply with the json object.
        }
    })

}

https.createServer({ key, cert }, app).listen(config.Server_Port, () => {   // Create secure HTTPS REST API
    DebugPrint("Server started and ready to respond.")
})

app.get('/', (req,res) => { // Redirect '/' to web interface.
    res.redirect('https://ovl.tech-user.fr:7070/')
})

app.get('/position/now/:id', (req,res) => { // Endpoint to get the actual position of a tracker based on his ID.
    HandlePositionActualRequest(req,res) // Trigger the Position request.
})

app.get('/user/:mail/:password', function (req,res) { // Endpoint to get the actual position of a tracker based on his ID.
    HandleUserInfoRequest(req,res) // Trigger the user information request handler.
})

app.get('/status/', (req,res) => {
    HandleStatusRequest(req,res) // Trigger the Status handler.
})

app.post('/user/', (req,res) => {   
    HandleUserAddRequest(req,res)
    
})
app.get('/iot_list/:token/', (req,res) => { // Return the list of trackers from a user token.
    HandleGetUserTrackers(req,res);
})

app.get('/test/position/history/:id/', (req,res) => { // Return position history of a tracker from his id
    HandleGetTrackerPositionHistory(req,res)
})

app.get('/test/status_list/:token/', (req,res) => {
    HandlerGetStatusList(req,res)
})

app.put('/set/status/:id_iot/:status_charge/:status_bat/:status_alarm/:status_ecomode/:status_protection/:status_vh-charge/', (res,req) => {
    HandlerSetStatus(req,res)
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
// List user
app.get('/test/status_list/', (req,res) => {
    let data_example = new Object()
    data_example.bat = 97
    data_example.charge = false
    data_example.vehiclechg  = false
    data_example.protection = true
    data_example.ecomode = true
    data_example.alarm = false
    data_example.gps = true

    let data_example2 = new Object()
    data_example2.bat = 97
    data_example2.charge = false
    data_example2.vehiclechg  = false
    data_example2.protection = true
    data_example2.ecomode = true
    data_example2.alarm = false
    data_example2.gps = true

    let ToReturn = new Object() // Create the return json object.
    DebugPrint("Received status request.")
    ToReturn.error = ERROR_CODES.ErrorOK // Storing the ErrorJson object template in the ToReturn json object.
    ToReturn.status_list = new Object() // Create the status json object.
    ToReturn.status_list[0] = data_example
    ToReturn.status_list[1] = data_example2
    ToReturn.status_list[1].bat = 65

    res.status(200).json(ToReturn) // Reply with the json object.
})

// List IOT

app.get('/test/users/:email/:password', (req,res) => {
    ToReturn = new Object();
    ToReturn.error = ERROR_CODES.ErrorOK; // Storing the ErrorJson object template in the ToReturn json object.
    mysql.CheckUserCredentials(req.params.email,function(data) {
        if(data.error.Code == 0)
        {
            data.data.password = data.data.password.replace('$2y$', '$2a$');
            if(bcrypt.compareSync(req.params.password,data.data.password))
            {
                res.status(200).json({error: ERROR_CODES.ErrorOK, token : data.data.token});
            }
            else
            {
                data.error = ERROR_CODES.ErrorUserWrongCredentials
                data.data = undefined
                res.status(200).json(data);
            }  
        }
        else
        {
            ToReturn.error = data.error
            res.status(200).json(ToReturn); // Reply with the error json object.
        }
    });
    
})

