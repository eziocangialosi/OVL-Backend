# Documentation API REST NodeJS

This API mediate between clients, MQTT Broker and the Database, the reponse format is in JSON.

This file document how to call the API and how she will respond, in all response there will be a error field with the following data in it : `{"error":{"ErrorCode":0,"Message":"Nothing went wrong"}`.

## Table of content

[GET API Call](#get-api-call "How to make a GET API Call and what data is retuned.")

[POST API Call](#post-api-call "How to make a POST API Call and what data is retuned.")

[PUT API Call](#put-api-call "How to make a PUT API Call and what data is retuned.")

[DELETE API Call](#delete-api-call "How to make a DELETE API Call and what data is retuned.")

[Sources](#sources "The sources.")

## GET API Call

First API call is a GET call, this call is dedicated to request data from the server, there is 2 types of GET call :

- GET without parameters :
  - Client API Request : http://127.0.0.1/status/ in this case the server return the global server status.
  - Server API Handle : ``app.get('/status/', (req,res) => { HandleStatusRequest(req,res) })``
  - Example of response ``{"error":{"ErrorCode":0,"Message":"Nothing went wrong"},"status":{"errors":0,"battery_state":100,"alarm":false}}``
- GET with parameters :
  - Client API Request : http://127.0.0.1/position/history/1234 where **"1234"** is a parameter, in this case the id of the tracker.
  - Server API Handle : ``app.get('/position/history/:id', (req,res) => { HandlePositionHistoryRequest(req,res) })`` to get the parameter we need to : ``const id = parseInt(req.params.id)`` where **id** is the parameter name set in the ``'/position/history/:id'``
  - Example of response ``{"error":{"ErrorCode":0,"Message":"Nothing went wrong"},"history":[{"posx":9.56454654,"posy":15.56454654,"timestamp":123456789}]}``

## POST API Call

TODO

## PUT API Call

TODO

## DELETE API Call

TODO

# Sources

###### [Welovedev Make a REST API with NodeJS and Express](https://welovedevs.com/fr/articles/node-js-api/)
