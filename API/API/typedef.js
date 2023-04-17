// /**
//  * @module namespace
//  * @description This module store all the custom type def for the documentation.
//  */
/**
* @namespace Error
* @property {Int} Code - The error code.
* @property {String} Message - The error message.
*/
/**
* @namespace Position
* @property {Float} lat - The latitude.
* @property {Float} lon - The longitude.
*/
/**
* @namespace Tracker
* @property {Int} id - The unique ID of the tracker.
* @property {String} trackerName - The tracker name.
*/
/**
* @namespace TrackerStatus
* @property {Int} bat - Battery percentage.
* @property {Bool} charge - Is the tracker charging.
* @property {Bool} veh_chg - Is the tracker allowed to charge.
* @property {Bool} eco_mode - Is the tracker in eco_mode.
* @property {Bool} protection - Is the tracker in protection mdoe.
* @property {Bool} alarm - Is the tracker alarm yelling.
* @property {Bool} gps - Is the tracker GPS signal OK.
*/
/** This Object type contain all de dtails of a specified Tracker.
* @namespace TrackerDetails
* @property {Int} id - The unique ID of the Tracker.
* @property {String} name - The name of the Tracker.
* @property {String} topicRX - The unique RX MQTT Topic.
* @property {String} topicTX - The unique TX MQTT Topic.
* @property {Position} pos - The `Position` Object of the Tracker.
* @property {Float} pos.lat - The latitude of the tracker.
* @property {Float} pos.lon - The longitude of the tracker.
* @property {TrackerStatus} status - Ths `TrackerStatus` Object of the Tracker.
* @property {Int} status.bat - Battery percentage.
* @property {Bool} status.charge - Is the tracker charging.
* @property {Bool} status.veh_chg - Is the tracker allowed to charge.
* @property {Bool} status.eco_mode - Is the tracker in eco_mode.
* @property {Bool} status.protection - Is the tracker in protection mdoe.
* @property {Bool} status.alarm - Is the tracker alarm yelling.
* @property {Bool} status.gps - Is the tracker GPS signal OK.
* @property {Int} timestamp - The timstamp of the last interaction with the Tracker.
 */
/**
* @namespace Topics
* @property {String} RX - RX MQTT Topic.
* @property {String} TX - TX MQTT Topic.
*/
/**
 * @namespace HandleGetTrackerPositionActual_data
 * @property {Error} error - Error Object.
 * @property {Int} error.Code - The error code.
 * @property {String} error.Message - The error message.
 * @property {Position} pos - GPS coords.
 * @property {Float} pos.lat - The latitude.
 * @property {Float} pos.lon - The longitude.
 */
/**
 * @namespace HandleGetTrackerPositionHistory_data
 * @property {Error} error - Error Object.
 * @property {Int} error.Code - The error code.
 * @property {String} error.Message - The error message.
 * @property {Position[]} history - Array of `Position` GPS coords.
 * @property {Float} history.lat - The latitude.
 * @property {Float} history.lon - The longitude.
 */
/**
 * @namespace HandleGetTrackerSafeZone_data
 * @property {Error} error - Error Object.
 * @property {Int} error.Code - The error code.
 * @property {String} error.Message - The error message.
 * @property {Float} lat - The latitude.
 * @property {Float} lon - The longitude.
 * @property {Float} diameter - The Safezone diameter.
 */
/**
 * @namespace HandleGetUserTrackers_data
 * @property {Error} error - Error Object.
 * @property {Int} error.Code - The error code.
 * @property {String} error.Message - The error message.
 * @property {String} token - Auth token of the user.
 * @property {Tracker[]} trackers - User's trackers array.
 * @property {Int} trackers.id - The unique ID of the tracker.
 * @property {String} trackers.trackerName - The tracker name.
 */
/**
 * @namespace HandleStatusRequest_data
 * @property {Error} error - Error Object.
 * @property {Int} error.Code - The error code.
 * @property {String} error.Message - The error message.
 * @property {TrackerStatus} status - Tracker `status`.
 * @property {Int} status.bat - Battery percentage.
 * @property {Bool} status.charge - Is the tracker charging.
 * @property {Bool} status.veh_chg - Is the tracker allowed to charge.
 * @property {Bool} status.eco_mode - Is the tracker in eco_mode.
 * @property {Bool} status.protection - Is the tracker in protection mdoe.
 * @property {Bool} status.alarm - Is the tracker alarm yelling.
 * @property {Bool} status.gps - Is the tracker GPS signal OK.
 */

/**
 * @namespace HandleUserInfoRequest_data
 * @property {Error} error - Error Object.
 * @property {Int} error.Code - The error code.
 * @property {String} error.Message - The error message.
 * @property {String} token - Auth token of the user.
 */

/**
 * @namespace HandleGetStatusList_data
 * @property {Error} error - Error Object.
 * @property {Int} error.Code - The error code.
 * @property {String} error.Message - The error message.
 * @property {TrackerStatus[]} status_list - Array of `TrackerStatus` Object.
 * @property {Int} status_list.bat - Battery percentage.
 * @property {Bool} status_list.charge - Is the tracker charging.
 * @property {Bool} status_list.veh_chg - Is the tracker allowed to charge.
 * @property {Bool} status_list.eco_mode - Is the tracker in eco_mode.
 * @property {Bool} status_list.protection - Is the tracker in protection mdoe.
 * @property {Bool} status_list.alarm - Is the tracker alarm yelling.
 * @property {Bool} status_list.gps - Is the tracker GPS signal OK.
 */
/**
 * @namespace HandleTrackerAddRequest_data
 * @property {Error} error - Error Object.
 * @property {Int} error.Code - The error code.
 * @property {String} error.Message - The error message.
 * @property {Int} TrackerId - Unique ID of the tracker.
 * @property {Topics} Topics - `Topics` Object RX and TX MQTT Topic.
 * @property {String} Topics.RX - RX MQTT Topic.
 * @property {String} Topics.TX - TX MQTT Topic.
 */
/**
 * @namespace HandleGetTrackerPositionGPX
 * @property {Error} error - Error Object.
 * @property {Int} error.Code - The error code.
 * @property {String} error.Message - The error message.
 * @property {String} gpx - String containing GPX file data.
 */

