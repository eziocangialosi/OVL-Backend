/**
 * @module Error_Codes
 * @description This module store all the error code and all the error message.
 * @example <caption>Use this module from another file.</caption>
 * const { ERROR_CODES } = require('./error_codes');
 * console.log(ERROR_CODES.ErrorOK)
*/
module.exports = {
    /**
     * JSON of all error codes.
     * @returns {object} All error codes and error message stored in a JSON.
     */
    ERROR_CODES: {
        ErrorOK: {
            Message: "Nothing goes wrong.",
            Code: 0,
        },
        ErrorUnknownError: {
            Message: "An unknown error has occurred, please check system logs.",
            Code: 1,
        },
        ErrorSQLUnavailable: {
            Message: "SQL Server Unavalable, contact system administrator.",
            Code: 10,
        },
        ErrorSQLConnectionRefused: {
            Message: "SQL Server rejected the credentials, contact system administrator.",
            Code: 11,
        },
        ErrorSQLSelectError: {
            Message: "Unable to retrieve the data from the database, please check system logs.",
            Code: 12,
        },
        ErrorSQLInjectError: {
            Message: "Unable to insert new data in the database, please check system logs.",
            Code: 13,
        },
        ErrorSQLUpdateError: {
            Message: "Unable to replace data in the database, please check system logs.",
            Code: 14,
        },
        ErrorSQLDeleteError: {
            Message: "Unable to delete data from the database, please check system logs.",
            Code: 15,
        },
        ErrorSQLTimeout: {
            Message: "Timeout during SQL request, please check system logs.",
            Code: 16,
        },
        ErrorMQTTConnectionRefused: {
            Message: "MQTT has denied the connection, please check system logs.",
            Code: 20,
        },
        ErrorMQTTTrackerUnavailable: {
            Message: "MQTT Can't access to the tracker, please check system logs.",
            Code: 21,
        },
        ErrorMQTTChecksumError: {
            Message: "MQTT Answer got altered, please check system logs.",
            Code: 22,
        },
        ErrorUserWrongCredentials: {
            Message: "The supplied password is wrong.",
            Code: 30,
        },
        ErrorUserAlreadyExist: {
            Message: "The specified mail already exist in the user DB.",
            Code: 31,
        },
        ErrorUserNotFound: {
            Message: "The specified mail is not associated with any account.",
            Code: 32,
        },
        ErrorUserHasNoTracker: {
            Message: "The specified user don't have any tracker.",
            Code: 33,
        },
        ErrorUserTokenIsInvalid: {
            Message: "The specified token is invalid.",
            Code: 34,
        },
        ErrorAPINotImplemented: {
            Message: "This API call is not implemented, check your request and try again.",
            Code: 90,
        },
        ErrorAPIInternalError: {
            Message: "API Got an internal error, check your request and try again.",
            Code: 91,
        },
        ErrorAPIWrongCall: {
            Message: "Wrong args for this API Call.",
            Code: 92,
        }
    }
}