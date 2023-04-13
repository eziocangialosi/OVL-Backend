/**
 * @module Notifications
 * @description This module contains all the handlers for all the REST API endpoints.
 * @example <caption>Use this module from another file.</caption>
 * const notifications = require('./notifications')
*/
const { Expo } = require('expo-server-sdk')
let expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });


function SendPushNotification(Device, Sound, Title, Desc, Data) {
  let messages = [];
  if (!Expo.isExpoPushToken(Device)) {
    console.error(`Push token ${Device} is not a valid Expo push token`);
    return
  }
  // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
  messages.push({
    to: Device,
    title: Title,
    sound: Sound,
    body: Desc,
    data: Data,
  })
  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  (async () => {
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error(error);
      }
    }
  })();
  let receiptIds = [];
  for (let ticket of tickets) {
    if (ticket.id) {
      receiptIds.push(ticket.id);
    }
  }

  let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
  (async () => {
    for (let chunk of receiptIdChunks) {
      try {
        let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
        console.log(receipts);
        for (let receiptId in receipts) {
          let { status, message, details } = receipts[receiptId];
          if (status === 'ok') {
            continue;
          } else if (status === 'error') {
            console.error(
              `There was an error sending a notification: ${message}`
            );
            if (details && details.error) {
              console.error(`The error code is ${details.error}`);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  })();
}

function SendMoveNotification(Device, TrackerName) {
  SendPushNotification(Device,'default',"Tracker Monitor | ⚠️ Unauthorized move ⚠️", "Unauthorized move of the vehicle with the tracker " + TrackerName,{});
}

//SendPushNotification("ExponentPushToken[jK2L7sMjMPkNEI_B6neF0Q]", 'default', 'OVL Project', 'Just a test notification for our backend.', {}) // Send a Notification to my iPhone SE 3 with the provided data.
SendMoveNotification("ExponentPushToken[jK2L7sMjMPkNEI_B6neF0Q]","Dacia Logan DCI 1.5");
module.exports = {
  /**
     * Send a notification to user iDevice in case of an Unauthorized Move of a tracker.
     * @param {(String)} Device - Device Expo Notification Token.
     * @param {(String)} TrackerName - Response object of the API CALL.
     */
  SendMoveNotification: function (Device, TrackerName) {
    SendMoveNotification(Device,TrackerName);
  }
}
