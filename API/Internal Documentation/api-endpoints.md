# API Endpoints :

| GET         | /user/{email}/{password}                                     |
| ----------- | ------------------------------------------------------------ |
| Used to     | Get an api token                                             |
| Json Output | `{"token": string, "error": {"code": int, "msg": string}}` |

| GET         | /iot/{id}                                                                                                                             |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Used to     | Get all data related to the tracker                                                                                                   |
| Json Output | `{"name": string, "topicTX": string, "topicRX": string, "iot_id": int, "mqtt_pswd": string, "error": {"code": int, "msg": string}}` |

| GET         | /iot_list/{token}                                                                            |
| ----------- | -------------------------------------------------------------------------------------------- |
| Used to     | Get all the tracker list for the user                                                        |
| Json Output | `{"iotArray": [{"name": string, "id": int},...], "error": {"code" : int, "msg" : string}}` |

| GET         | /status/{id}                                                                                                                                                                       |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Used to     | Obtain the status of the requested tracer                                                                                                                                          |
| Json Output | `{"bat": int, "charge": bool, "vehiclechg": bool, "protection": bool, "ecomode": bool, "alarm": bool, "protection": bool, "gps": bool, "error": {"code" : int, "msg" : string}}` |

| GET         | /status_list                                                                                                                                                                                             |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Used to     | Obtain the status list of all the user's tracer                                                                                                                                                          |
| Json Output | `{"status_list":[{"bat": int, "charge": bool, "vehiclechg": bool, "protection": bool, "ecomode": bool, "alarm": bool, "protection": bool, "gps": bool},...], "error": {"code" : int, "msg" : string}}` |

| GET         | /position/now/{id}                                                      |
| ----------- | ----------------------------------------------------------------------- |
| Used to     | Get the current position of the tracker based on his id                                |
| Json Output | `{"lon": float, "lat": float, "error": {"code": int, "msg": string}}` |

| GET         | /position/history/{id}                                                                                       |
| ----------- | ------------------------------------------------------------------------------------------------------------ |
| Used to     | Obtain all position history of a tracker based on his id                                                                      |
| Json Output | `{"history": [{"lon": float, "lat": float, "timestamp": int},...], "error": {"code": int, "msg": string}}` |

| PUT         | /protection/{id}/{state}                    |
| ----------- | ------------------------------------------- |
| Used to     | (Des)Active parking mode for the tracker    |
| Json Output | `{"error": {"code": int, "msg": string}}` |

| PUT         | /sensibility/{id}/{diameter}                |
| ----------- | ------------------------------------------- |
| Used to     | Update the diameter of the safe zone        |
| Json Output | `{"error": {"code": int, "msg": string}}` |

| PUT         | /allow_charge/{id}/{state}                    |
| ----------- | --------------------------------------------- |
| Used to     | (Des)Active tracker charge on vehicle battery |
| Json Output | `{"error": {"code": int, "msg": string}}`   |

| PUT         | /eco_mode/{id}/{state}                      |
| ----------- | ------------------------------------------- |
| Used to     | (Des)Active tracker energy eco-mode         |
| Json Output | `{"error": {"code": int, "msg": string}}` |

| PUT         | /allow_charge/{id}/{state}                    |
| ----------- | --------------------------------------------- |
| Used to     | (Des)Active tracker charge on vehicle battery |
| Json Output | `{"error": {"code": int, "msg": string}}`   |

| PUT         | /sub_alarm/{id}/{state}                                       |
| ----------- | ------------------------------------------------------------- |
| Used to     | (Un)subscribe from tracker alerts (moving, low battery, etc.) |
| Json Output | `{"error": {"code": int, "msg": string}}`                   |

| POST        | /iot/{token}/{name}                                                                                                   |
| ----------- | --------------------------------------------------------------------------------------------------------------------- |
| Used to     | Add and link a tracker to the account and get the parameters needed to configure the tracker                          |
| Json Output | `{"topicTX": string, "topicRX": string, "iot_id": int, "mqtt_pswd": string, "error": {"code": int, "msg": string}}` |

| DELETE      | /iot/{name}                                 |
| ----------- | ------------------------------------------- |
| Used to     | Delete from system a tracker                |
| Json Output | `{"error": {"code": int, "msg": string}}` |

| DELETE      | /user/{mail}                                |
| ----------- | ------------------------------------------- |
| Used to     | Delete a user from system                   |
| Json Output | `{"error": {"code": int, "msg": string}}` |

- POST /user/:mail :password -> json{”error”:  {“code” : int, “msg” : string}}
