# API Endpoints :

- GET /position/history/:id -> json {“history”: [{“posx”: float, “posy” : float, "timestamp" : int},…],”error”:  {“code” : int, “msg” : string}}
- GET /position/now/:id -> json{“now”: {“posx”,”poxy”}, ”error”:  {“code” : int, “msg” : string}}}
- GET /user/:mail :password -> json{“session-id” : int, ”nbIoT” : int, ”IoTArray” : [{"name": string, "id" : int}, ...], ”error”: {“code” : int, “msg” : string}}
- GET /status/ :id -> json{« status » : {“error” : int,  “battery” :  int, “alarm” : bool}}
- POST /user/:mail :password -> json{”error”:  {“code” : int, “msg” : string}}
- POST /iot /:name -> json{”error”:  {“code” : int, “msg” : string}}
- PUT /alarm/ :id :state -> json{”error”:  {“code” : int, “msg” : string}}
- PUT /allow_charge / :id :state -> json{”error”:  {“code” : int, “msg” : string}}
- DELETE /iot /:name -> json{”error”:  {“code” : int, “msg” : string}}
- DELETE /user /:mail -> json{”error”:  {“code” : int, “msg” : string}}
