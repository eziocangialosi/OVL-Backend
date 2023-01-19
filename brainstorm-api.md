Brainstorm on the api requests to implement 
------------
- [ ] credentials user
- [ ] position gps + timestamp
- [ ] file gpx --> history
- [ ] OAuth2
- [ ] Status IoT (Error Code, %Bat, Alarm On/Off)
- [ ] Rq Enable/Disable alarm
- [ ] Zone "safe" :
    - [ ] Configuration
    - [ ] Rq create/modif
- [ ] Ajout IoT et désig par nom
    --> API return 2 topics (RX/TX), IOT internal number + credentials MQTT
- [ ] Enable/Disable Charge over vehicle battery.



## API Endpoints :

- GET /position/history/:id -> json {“history”: [{“posx”: float, “posy” : float, "timestamp" : int},…],”error”:  {“code” : int, “msg” : string}}
- GET /position/now/:id -> json{“now”: {“posx”,”poxy”}, ”error”:  {“code” : int, “msg” : string}}}
- POST /user/:mail :password -> json{”error”:  {“code” : int, “msg” : string}}
- GET /user/:mail :password -> json{“session-id” : int ,”error”:  {“code” : int, “msg” : string}}
- GET /status/ :id -> json{« status » : {“error” : int,  “battery” :  int, “alarm” : bool}}
- PUT /alarm/ :id :state -> json{”error”:  {“code” : int, “msg” : string}}
- PUT /allow_charge / :id :state -> json{”error”:  {“code” : int, “msg” : string}}
- POST /iot /:name -> json{”error”:  {“code” : int, “msg” : string}}
- DELETE /iot /:name -> json{”error”:  {“code” : int, “msg” : string}}
- DELETE /user /:mail -> json{”error”:  {“code” : int, “msg” : string}}
