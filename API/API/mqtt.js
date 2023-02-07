const mqtt = require('mqtt')
const date = require('./date')
const { ERROR_CODES } = require('./error_codes')
const mysql = require('./mysql')
const client = mqtt.connect('mqtt://ovl.tech-user.fr:6868')
const debug = require('./debug')

var GlobalTrackerList = new Array();
client.on('connect', function () {
    mysql.GetAllTrackersTopics(function(data) {
        if(data.error == ERROR_CODES.ErrorOK) {
            for(let i = 0; i < data.trackers.length; i++) {
                GlobalTrackerList[i] = {
                    id: data.trackers[i].id,
                    name: data.trackers[i].trackerName,
                    topicRX: data.trackers[i].topicRX,
                    topicTX: data.trackers[i].topicTX,
                    pos: {},
                    status: {},
                    timestamp: 0,
                }
                client.subscribe(data.trackers[i].topicTX, function (err) {
                    if (!err) {
                        client.publish(data.trackers[i].topicRX, 'PING')
                    }
                    else {
                        console.error("[TEST SERVER CONNECTION] Error in MQTT connection for topic ["+data.trackers[i].topicTX+"] !")
                    }
                })
            }
            setTimeout(() => {
                CheckTrackersPingResponse()
            }, 5000);
        }
    })
})

function CheckTrackersPingResponse()
{
    var OfflineDevices = 0
    for(let i = 0; i < GlobalTrackerList.length; i++) {
        if(GlobalTrackerList[i].timestamp == 0) {
            OfflineDevices ++
        }
    }
    debug.Print("Init loop finished "+OfflineDevices+" offline devices on "+GlobalTrackerList.length+" devices.")
}

client.on('message', function (topic, message) {
    debug.Print("Received MQTT message : "+message.toString())
    topic = topic.replace('TX','RX') // Replace topic type to respond on other topic.
    if (message.toString().startsWith("SYN")) { // Confirm connection to tracker (Acknowledge Hand Check).
        client.publish(topic, 'SYN-ACK') // Respond to the message.
    }
    else if (message.toString().startsWith("STS=")) { // Acknowledge reception of status and get status data of the tracker. mosquitto_pub -h ovl.tech-user.fr -p 6868 -t TX -m "STS=bat,charge,veh_chg,eco-mode,protection,alarm,gps"
        TrackerStatus = {
            bat: message.toString().split('=')[1].split(',')[0],
            charge: message.toString().split(',')[1].split(',')[0],
            veh_chg: message.toString().split(',')[2].split(',')[0],
            eco_mode: message.toString().split(',')[3].split(',')[0],
            protection: message.toString().split(',')[4].split(',')[0],
            alarm: message.toString().split(',')[5].split(',')[0],
            gps: message.toString().split(',')[6],
        }
        for(let i = 0; i < GlobalTrackerList.length; i++) {
            if(GlobalTrackerList[i].topic == id) {
                GlobalTrackerList[i].status = TrackerStatus
                break
            }
        }
        mysql.UpdateTrackerStatus(TrackerStatus,topic,function(data)
        {
            if(data.error == ERROR_CODES.ErrorOK) {
                client.publish(topic, 'STS-ACK') // Respond to the message.
            }
        })
    }
    else if (message.toString().startsWith("PING")) { // Ping request from Tracker.
        client.publish(topic, 'PONG') // Respond to the message.
    }
    else if (message.toString().startsWith("PONG")) { // Ping request from Tracker.
        for(let i = 0; i < GlobalTrackerList.length; i++) {
            if(GlobalTrackerList[i].topicRX == topic) {
                GlobalTrackerList[i].timestamp = date.GetTimestamp()
                break
            }
        }
    }
    else if (message.toString().startsWith("POS=")) { // Position of the tracker.
        TrackerPosition = {
            lon: message.toString().split('=')[1].split(',')[0],
            lat: message.toString().split(',')[1],
        }
        for(let i = 0; i < GlobalTrackerList.length; i++) {
            if(GlobalTrackerList[i].topicRX == topic) {
                GlobalTrackerList[i].timestamp = date.GetTimestamp()
                GlobalTrackerList[i].pos = TrackerPosition
                break
            }
        }
        client.publish(topic, 'POS-ACK') // Respond to the message.
    }
    else if (message.toString().startsWith("POS-ERR")) { // Position error for the tracker.
        client.publish(topic, 'POS-ACK') // Respond to the message.
    }
    else if (message.toString().startsWith("ALM")) { // Position error for the tracker.
        client.publish(topic, 'ALM-ACK') // Respond to the message.
    }
})

function RequestTrackerStatus(id,callback) {
    var Tracker
    var OldTimestamp
    ToReturn = new Object()
    ToReturn.error = ERROR_CODES.ErrorOK
    for(let i = 0; i < GlobalTrackerList.length; i++) {
        if(GlobalTrackerList[i].id == id) {
            Tracker = i
            OldTimestamp = GlobalTrackerList[i].timestamp
            client.publish(GlobalTrackerList[i].topicRX, 'STS-RQ')
            break
        }
    }
    setTimeout(() => { // Wait 5s for tracker to respond.
        if(GlobalTrackerList[Tracker].timestamp == OldTimestamp) {
            ToReturn.error = ERROR_CODES.ErrorMQTTTrackerUnavailable
        }
        else {
            ToReturn.position = GlobalTrackerList[Tracker].status
        }
        callback(ToReturn)
    }, 5000);
}

function PingTracker(id,callback) {
    var Tracker
    var OldTimestamp
    ToReturn = new Object()
    ToReturn.error = ERROR_CODES.ErrorOK
    for(let i = 0; i < GlobalTrackerList.length; i++) {
        if(GlobalTrackerList[i].id == id) {
            Tracker = i
            OldTimestamp = GlobalTrackerList[i].timestamp
            client.publish(GlobalTrackerList[i].topicRX, 'PING')
            break
        }
    }
    setTimeout(() => { // Wait 5s for tracker to respond.
        if(GlobalTrackerList[Tracker].timestamp == OldTimestamp) {
            ToReturn.error = ERROR_CODES.ErrorMQTTTrackerUnavailable
        }
        else {
            ToReturn.position = GlobalTrackerList[Tracker].pos
        }
        callback(ToReturn)
    }, 5000);
}

function RequestTrackerPosition(id,callback) {
    var Tracker
    var OldTimestamp
    ToReturn = new Object()
    ToReturn.error = ERROR_CODES.ErrorOK
    for(let i = 0; i < GlobalTrackerList.length; i++) {
        if(GlobalTrackerList[i].id == id) {
            Tracker = i
            OldTimestamp = GlobalTrackerList[i].timestamp
            client.publish(GlobalTrackerList[i].topicRX, 'POS-RQ')
            break
        }
    }
    setTimeout(() => { // Wait 5s for tracker to respond.
        if(GlobalTrackerList[Tracker].timestamp == OldTimestamp) {
            ToReturn.error = ERROR_CODES.ErrorMQTTTrackerUnavailable
        }
        else {
            ToReturn.position = GlobalTrackerList[Tracker].pos
        }
        callback(ToReturn)
    }, 5000);
}

module.exports = {
    RequestTrackerPosition: function(id,callback) {
        RequestTrackerPosition(id,callback)
    },
    RequestTrackerStatus: function (id,callback) {
        RequestTrackerStatus(id,callback)
    }
}