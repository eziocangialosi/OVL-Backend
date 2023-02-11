/**
 * @module Error_Codes
 * @description This module store all the error code and all the error message.
 * @example <caption>Use this module from another file.</caption>
 * const { ERROR_CODES } = require('./error_codes');
 * console.log(ERROR_CODES.ErrorOK)
*/
module.exports = {
    ERROR_CODES: {
        /**
        * @typedef {Error} ErrorOK
        * @property {Int} Code - The error code.
        * @property {String} Message - The error message.
        */
        ErrorOK: {
            Message: "Nothing goes wrong.",
            Code: 0,
        },
         /**
        * @typedef {Error} ErrorUnknownError
        * @property {Int} Code - The error code.
        * @property {String} Message - The error message.
        */
        ErrorUnknownError: {
            Message: "An unknown error has occurred, please check system logs.",
            Code: 1,
        },
         /**
        * @typedef {Error} ErrorSQLUnavailable
        * @property {Int} Code - The error code.
        * @property {String} Message - The error message.
        */
        ErrorSQLUnavailable: {
            Message: "SQL Server Unavalable, contact system administrator.",
            Code: 10,
        },
         /**
        * @typedef {Error} ErrorSQLConnectionRefused
        * @property {Int} Code - The error code.
        * @property {String} Message - The error message.
        */
        ErrorSQLConnectionRefused: {
            Message: "SQL Server rejected the credentials, contact system administrator.",
            Code: 11,
        },
         /**
        * @typedef {Error} ErrorSQLSelectError
        * @property {Int} Code - The error code.
        * @property {String} Message - The error message.
        */
        ErrorSQLSelectError: {
            Message: "Unable to retrieve the data from the database, please check system logs.",
            Code: 12,
        },
         /**
        * @typedef {Error} ErrorSQLInjectError
        * @property {Int} Code - The error code.
        * @property {String} Message - The error message.
        */
        ErrorSQLInjectError: {
            Message: "Unable to insert new data in the database, please check system logs.",
            Code: 13,
        },
         /**
        * @typedef {Error} ErrorSQLUpdateError
        * @property {Int} Code - The error code.
        * @property {String} Message - The error message.
        */
        ErrorSQLUpdateError: {
            Message: "Unable to replace data in the database, please check system logs.",
            Code: 14,
        },
         /**
        * @typedef {Error} ErrorSQLDeleteError
        * @property {Int} Code - The error code.
        * @property {String} Message - The error message.
        */
        ErrorSQLDeleteError: {
            Message: "Unable to delete data from the database, please check system logs.",
            Code: 15,
        },
         /**
        * @typedef {Error} ErrorSQLTimeout
        * @property {Int} Code - The error code.
        * @property {String} Message - The error message.
        */
        ErrorSQLTimeout: {
            Message: "Timeout during SQL request, please check system logs.",
            Code: 16,
        },
         /**
        * @typedef {Error} ErrorMQTTConnectionRefused
        * @property {Int} Code - The error code.
        * @property {String} Message - The error message.
        */
        ErrorMQTTConnectionRefused: {
            Message: "MQTT has denied the connection, please check system logs.",
            Code: 20,
        },
         /**
        * @typedef {Error} ErrorMQTTTrackerUnavailable
        * @property {Int} Code - The error code.
        * @property {String} Message - The error message.
        */
        ErrorMQTTTrackerUnavailable: {
            Message: "MQTT Can't access to the tracker, please check system logs.",
            Code: 21,
        },
         /**
        * @typedef {Error} ErrorMQTTChecksumError
        * @property {Int} Code - The error code.
        * @property {String} Message - The error message.
        */
        ErrorMQTTChecksumError: {
            Message: "MQTT Answer got altered, please check system logs.",
            Code: 22,
        },
        /**
        * @typedef {Error} ErrorUserWrongCredentials
        * @property {Int} Code - The error code.
        * @property {String} Message - The error message.
        */
        ErrorUserWrongCredentials: {
            Message: "The supplied password is wrong.",
            Code: 30,
        },
         /**
        * @typedef {Error} ErrorUserAlreadyExist
        * @property {Int} Code - The error code.
        * @property {String} Message - The error message.
        */
        ErrorUserAlreadyExist: {
            Message: "The specified mail already exist in the user DB.",
            Code: 31,
        },
         /**
        * @typedef {Error} ErrorUserNotFound
        * @property {Int} Code - The error code.
        * @property {String} Message - The error message.
        */
        ErrorUserNotFound: {
            Message: "The specified mail is not associated with any account.",
            Code: 32,
        },
         /**
        * @typedef {Error} ErrorUserHasNoTracker
        * @property {Int} Code - The error code.
        * @property {String} Message - The error message.
        */
        ErrorUserHasNoTracker: {
            Message: "The specified user don't have any tracker.",
            Code: 33,
        },
         /**
        * @typedef {Error} ErrorUserTokenIsInvalid
        * @property {Int} Code - The error code.
        * @property {String} Message - The error message.
        */
        ErrorUserTokenIsInvalid: {
            Message: "The specified token is invalid.",
            Code: 34,
        },
         /**
        * @typedef {Error} ErrorAPINotImplemented
        * @property {Int} Code - The error code.
        * @property {String} Message - The error message.
        */
        ErrorAPINotImplemented: {
            Message: "This API call is not implemented, check your request and try again.",
            Code: 90,
        },
        /**
        * @typedef {Error} ErrorAPIInternalError
        * @property {Int} Code - The error code.
        * @property {String} Message - The error message.
        */
        ErrorAPIInternalError: {
            Message: "API Got an internal error, check your request and try again.",
            Code: 91,
        },
         /**
        * @typedef {Error} ErrorAPIWrongCall
        * @property {Int} Code - The error code.
        * @property {String} Message - The error message.
        */
        ErrorAPIWrongCall: {
            Message: "Wrong args for this API Call.",
            Code: 92,
        }
    }
}