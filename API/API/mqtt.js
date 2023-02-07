const mqtt = require('mqtt')
const mysql = require('./mysql')
const client = mqtt.connect('mqtt://ovl.tech-user.fr:6868')

client.on('connect', function () {
    client.subscribe('TX', function (err) {
        if (!err) {
            client.publish('TX', '[TEST SERVER CONNECTION] OK')
        }
        else {
            console.error("[TEST SERVER CONNECTION] Error in MQTT connection !")
        }
    })
})

client.on('message', function (topic, message) {
    console.log(message.toString())
    if (message.toString().startsWith("SYN")) { // Confirm connection to tracker (Acknowledge Hand Check).
        client.publish('RX', 'SYN-ACK') // Respond to the message.
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
        mysql.UpdateTrackerStatus(TrackerStatus,topic,function(data)
        {
            console.log(data)
        })
        client.publish('RX', 'STS-ACK') // Respond to the message.
    }
    else if (message.toString().startsWith("PING")) { // Ping request from Tracker.
        client.publish('RX', 'PONG') // Respond to the message.
    }
    else if (message.toString().startsWith("POS=")) { // Position of the tracker.
        TrackerPosition = {
            lon: message.toString().split(',')[0].split('=')[1],
            lat: message.toString().split(',')[1].split('='),
        }
        client.publish('RX', 'POS-ACK') // Respond to the message.
    }
    else if (message.toString().startsWith("POS-ERR")) { // Position error for the tracker.
        client.publish('RX', 'POS-ACK') // Respond to the message.
    }
    else if (message.toString().startsWith("ALM")) { // Position error for the tracker.
        client.publish('RX', 'ALM-ACK') // Respond to the message.
    }
    //client.end()
})

function RequestTrackerStatus() {
    client.publish('RX', 'STS-RQ')
}

function PingTracker() {
    client.publish('RX', 'PING')
}

function RequestTrackerPosition() {
    client.publish('RX', 'POS-RQ')
}