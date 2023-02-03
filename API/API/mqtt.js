const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://ovl.tech-user.fr:6868')

client.on('connect', function () {
    client.subscribe('test', function (err) {
        if (!err) {
            client.publish('test', '[TEST SERVER CONNECTION] OK')
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
    else if (message.toString().startsWith("STS=")) { // Acknowledge reception of status and get status data of the tracker.
        TrackerStatus = {
            bat: message.toString().split(',')[0].split('=')[1],
            charge: message.toString().split(',')[1].split(',')[1],
            veh_chg: message.toString().split(',')[2].split(',')[1],
            eco_mode: message.toString().split(',')[3].split(',')[1],
            protection: message.toString().split(',')[4].split(',')[1],
            alarm: message.toString().split(',')[5].split(',')[1],
            gps: message.toString().split(',')[6],
        }
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