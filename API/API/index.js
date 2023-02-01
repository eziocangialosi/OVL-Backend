const fs = require('fs');
const path = require('path');
const https = require('https');
const express = require('express'); // Required for the REST API to work.
const date = require('./date')
const encryption = require('./encryption')
const mysql = require('./mysql')
const jwt = require('jsonwebtoken');
//const salt = bcrypt.genSaltSync(10);
var bcrypt = require('bcrypt');

const app = express() // Create the REST API
const key = fs.readFileSync(path.join(__dirname, 'certificate', 'key.pem'));
const cert = fs.readFileSync(path.join(__dirname, 'certificate', 'cert.pem'));
const options = { key, cert };
const LISTENING_PORT = 8080
const DEBUG = true
const ERROR_CODES = require('./error_codes').ERROR_CODES;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function DebugPrint(data) { // THIS DEBUG PRINT.
    if(DEBUG == true)
    {
        console.log("["+date.GetDate()+"] ["+date.GetTime()+"] -> "+data)
    }
}

function GetErrorJson() {
    let ErrorJson = new Object()
    ErrorJson.ErrorCode = 0
    ErrorJson.Message = "Nothing went wrong"
    return ErrorJson
}

function HandlePositionHistoryRequest(req,res) {
    let ToReturn = new Object() // Create the return json object.
    const id = parseInt(req.params.id) // Get the id passed in parameters.
    DebugPrint("Received position history request for "+id.toString()+".")
    ToReturn.error = GetErrorJson() // Storing the ErrorJson object template in the ToReturn json object.
    ToReturn.history = [] // Make an array to store all the position retrieved from the DB.
    ToReturn.history[0] = new Object()
    ToReturn.history[0].posx = 9.56454654 // Setting PosX of the position in the object.
    ToReturn.history[0].posy = 15.56454654 // Setting PosY of the position in the object.
    ToReturn.history[0].timestamp = 123456789 // Setting timestamp of the position in the object.
    res.status(200).json(ToReturn) // Reply with the json object.
}

function HandlePositionActualRequest(req,res) {
    let ToReturn = new Object() // Create the return json object.
    const id = parseInt(req.params.id) // Get the id passed in parameters.
    DebugPrint("Received actual position request for "+id.toString()+".")
    ToReturn.error = GetErrorJson() // Storing the ErrorJson ocject template in the ToReturn json object.
    ToReturn.now = new Object() // Creating the json now object. 
    ToReturn.now.posx = 9.56454654 // Setting PosX of the tracker in the object.
    ToReturn.now.posy = 15.56454654 // Setting PosY of the tracker in the object.
    res.status(200).json(ToReturn) // Reply with the json object.
}

function HandleUserInfoRequest(req,res) {
    DebugPrint("Received user information request for "+req.params.mail+" with password : "+req.params.password+".")
    mysql.CheckUserCredentials(req.params.mail,function(UserCredentials) {
        if(UserCredentials.error.Code == 0)
        {
            UserCredentials.data.password = UserCredentials.data.password.replace('$2y$', '$2a$');
            if(bcrypt.compareSync(req.params.password,UserCredentials.data.password))
            {
                mysql.GetUserTrackers(UserCredentials.data.id,function(UserTrackers) {
                    if(UserTrackers.error.Code == 0)
                    {
                        res.status(200).json({user : UserCredentials.data.token, trackers : UserTrackers}) // Reply with the json object.
                    }
                    else
                    {
                        res.status(200).json({user : UserCredentials.data.token, trackers : UserTrackers}) // Reply with the json object.
                    }
                });
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

function HandleStatusRequest(req,res) {
    let ToReturn = new Object() // Create the return json object.
    DebugPrint("Received status request.")
    ToReturn.error = GetErrorJson() // Storing the ErrorJson object template in the ToReturn json object.
    ToReturn.status = new Object() // Create the status json object.
    ToReturn.status.errors = 0
    ToReturn.status.battery_state = 100
    ToReturn.status.alarm = false
    res.status(200).json(ToReturn) // Reply with the json object.
}

function HandleUserAddRequest(req,res) {
    let ToReturn = new Object() // Create the return json object.
    DebugPrint("Received add user request with the following mail and password : "+req.body.mail+" "+req.body.password)
    encryption.EncryptPassword(req.body.password,function(hash)
    {
        mysql.AddUserToDb(req.body.mail,hash,"I need to dev this shit but i dont have very envie",function(data) {
            ToReturn = data
            res.status(200).json(ToReturn) // Reply with the json object.
        });
    })
    
}


app.get('/position/history/:id', (req,res) => { // Endpoint to get history of all positions of a tracker based on his ID.
    HandlePositionHistoryRequest(req,res) // Trigger the History handler.
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

https.createServer(options, app).listen(LISTENING_PORT, () => {  
    DebugPrint("Server started and ready to respond.")
})

// THIS IS THE NO NO ZONE
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
    ToReturn.error = GetErrorJson() // Storing the ErrorJson object template in the ToReturn json object.
    ToReturn.status_list = new Object() // Create the status json object.
    ToReturn.status_list[0] = data_example
    ToReturn.status_list[1] = data_example2
    ToReturn.status_list[1].bat = 65

    res.status(200).json(ToReturn) // Reply with the json object.
})

// List IOT

app.get('/test/iot_list/', (req,res) => {
    let data_example = new Object()
    data_example.name = 'C15'
    data_example.id = 01
    let data_example2 = new Object()
    data_example2.name = 'Freewind de merde'
    data_example2.id = 02
    let ToReturn = new Object() // Create the return json object.
    DebugPrint("Received status request.")
    ToReturn.error = GetErrorJson() // Storing the ErrorJson object template in the ToReturn json object.
    ToReturn.iotArray = new Object() // Create the status json object.
    ToReturn.iotArray[0] = data_example
    ToReturn.iotArray[1] = data_example2
    res.status(200).json(ToReturn) // Reply with the json object.

})


// History Pos

app.get('/test/position/history/:id/', (req,res) => {
    let data_example = new Object()
    data_example.lat = 56.491491
    data_example.lon = 98.146514
    data_example.timestamp = 156546289
    let data_example2 = new Object()
    data_example2.lat = 2.491491
    data_example2.lon = 85.146514
    data_example2.timestamp = 266546289
    let ToReturn = new Object() // Create the return json object.
    DebugPrint("Received status request.")
    ToReturn.error = GetErrorJson() // Storing the ErrorJson object template in the ToReturn json object.
    ToReturn.history = new Object() // Create the status json object.
    ToReturn.history[0] = data_example
    ToReturn.history[1] = data_example2
    res.status(200).json(ToReturn) // Reply with the json object.

})

app.get('/test/users/:email/:password', (req,res) => {
    ToReturn = new Object();
    ToReturn.error = GetErrorJson(); // Storing the ErrorJson object template in the ToReturn json object.
    mysql.CheckUserCredentials(req.params.email,function(data) {
        if(data.error.Code == 0)
        {
            data.data.password = data.data.password.replace('$2y$', '$2a$');
            if(bcrypt.compareSync(req.params.password,data.data.password))
            {
                res.status(200).json(data);
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

