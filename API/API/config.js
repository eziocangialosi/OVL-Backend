/** This is the configuration of the entire REST API.
 * @namespace Config
 * @example <caption>Use this module from another file.</caption>
 * const config = require('./config')
 * if (config.Debug == true) {
    console.log("Debug is ON")
}
 * @property {Bool}    Debug - Whatever the Debug mode is ON/OFF.
 * @property {Object}  Certificate - SSL Settings for the REST API Server.
 * @property {Object}  Certificate.Certificate_folder - Folder where SSL data is stored.
 * @property {String}  Certificate.Key - The name of the Key file.
 * @property {String}  Certificate.Cert.gold - The name of the Cert file.
 * @property {Int}     Server_Port - The port on which the API is accessible.
 * @property {Object}  MQTT - MQTT server config.
 * @property {String}  MQTT.Server - Url of the MQTT broker.
 * @property {String}  MQTT.Username - Username of the REST API for MQTT.
 * @property {String}  MQTT.Password - Password of the REST API for MQTT.
 * @property {Int}     TrackerCheckTime - The time between 2 Pos request to the tracker.
 * @property {Int}     QuantityOfPosPerTracker - The quantity of position stored in DB per tracker.
 * @property {Object}  Database_Config - MariaDB Server config.
 * @property {String}  Database_Config.host - MariaDB Server IP Adress or Domain Name.
 * @property {String}  Database_Config.user - MariaDB Server Username.
 * @property {String}  Database_Config.password - MariaDB Server Password.
 * @property {String}  Database_Config.database - MariaDB Server Database Name.
 * @property {Object}  Discord - Discord webhooks config.
 * @property {Bool}  Discord.Enabled - Whatever Discord webhooks is enabled or not.
 * @property {String}  Discord.WebhookURL - Discord webhook URL.
 * @property {String}  AdministrationURL - URL of the Administration Website.
 */
module.exports = {
    "Debug": true,
    "Certificate": {
        "Certificate_folder": "certificate",
        "Key": "key.pem",
        "Cert": "cert.pem"
    },
    "Server_Port": 8080,
    "MQTT": {
        "Server" : "mqtt://ovl.tech-user.fr:6868",
        "Username" : "MQTT_REST_API",
        "Password" : "ABigAndKomplexP@ssWord"
    },
    "TrackerCheckTime": 299,
    "QuantityOfPosPerTracker": 20,
    "Database_Config": {
        "host": "192.168.1.18",
        "user": "root",
        "password": "ABigAndKomplexP@ssWord",
        "database": "OVL"
    },
    "Discord" : {
        "Enabled" : true,
        "WebhookURL" : "https://discord.com/api/webhooks/1065751821341163681/YSiE2-n0Tf-OhFhafSv52-lkYP7uYFmRV1B52WdY76drvGg9umZdaVsP3FE3l3YekwRr",
    },
    "AdministrationURL": "https://ovl.tech-user.fr:7070/"
}