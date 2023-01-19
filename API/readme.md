# Documentation API REST NodeJS


All response format are in json

First API call is a GET call, this call is dedicated to request data from the server, there is 2 types of GET call :
- GET without parameters :
  - Client API Request : http://127.0.0.1/status/ in this case the server return the global server status.
  - Server API Handle : ```app.get('/status/', (req,res) => {
    HandleStatusRequest(req,res)
})```
   - Example of response ```{"error":{"ErrorCode":0,"Message":"Nothing went wrong"},"status":{"errors":0,"battery_state":100,"alarm":false}}```
- GET with parameters :
  - Client API Request : http://127.0.0.1/position/history/1234 where **"1234"** is a parameter, in this case the id of the tracker.
  - Server API Handle : ```app.get('/position/history/:id', (req,res) => {
    HandlePositionHistoryRequest(req,res)
})``` to get the parameter we need to : ```const id = parseInt(req.params.id)``` where **id** is the parameter name set in the ```'/position/history/:id'```
   - Example of response ```{"error":{"ErrorCode":0,"Message":"Nothing went wrong"},"history":[{"posx":9.56454654,"posy":15.56454654,"timestamp":123456789}]}```
