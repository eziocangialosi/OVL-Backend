const express = require('express') // Required for the REST API to work.
const date = require('./date')
const app = express() // Create the REST API
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const LISTENING_PORT = 8080
const DEBUG = true
let ERROR_CODES = new Object()
ERROR_CODES.ConnectionToIOTUnavailable = -1
ERROR_CODES.TrackerNotExist = -2
ERROR_CODES.AccountUnauthorised = -3
ERROR_CODES.PositionUnavailable = -4


function DebugPrint(data) {
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
    let ToReturn = new Object() // Create the return json object.
    DebugPrint("Received user information request for "+req.params.mail+"with password : "+req.params.password+".")
    ToReturn.error = GetErrorJson() // Storing the ErrorJson ocject template in the ToReturn json object.
    ToReturn.session_id = 0 // Set the session ID.
    res.status(200).json(ToReturn) // Reply with the json object.
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
    DebugPrint("Received add user request with the following mail and password : "+req.body.mail+" "+req.body.password)
    res.status(200).json(GetErrorJson())
}

app.get('/position/history/:id', (req,res) => { // Endpoint to get history of all positions of a tracker based on his ID.
    HandlePositionHistoryRequest(req,res) // Trigger the History handler.
})

app.get('/position/now/:id', (req,res) => { // Endpoint to get the actual position of a tracker based on his ID.
    HandlePositionActualRequest(req,res) // Trigger the Position request.
})

app.get('/user/:mail/:password', (req,res) => { // Endpoint to get the actual position of a tracker based on his ID.
    HandleUserInfoRequest(req,res) // Trigegr the user information request handler.
})

app.get('/status/', (req,res) => {
    HandleStatusRequest(req,res) // Trigger the Status handler.
})

app.post('/user/', (req,res) => {   
    HandleUserAddRequest(req,res)
    
})

app.listen(LISTENING_PORT, () => {  
    DebugPrint("Server started and ready to respond.")
})
