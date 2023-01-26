var mysql = require('mysql') // Required for the REST API to work.
var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "Pornhub",
    database: "Test"
});
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

function GetErrorJson() {
    let ErrorJson = new Object()
    ErrorJson.ErrorCode = 0
    ErrorJson.Message = "Nothing went wrong"
    return ErrorJson
}


function GetUserInformation(mail,pass,callback) {
    ToReturn = new Object();
    ToReturn.error = GetErrorJson();
    con.query("SELECT * FROM users WHERE email='"+mail+"' AND password='"+pass+"'", (err, result) => {
    if (err) {
        console.error(err)
        ToReturn.Message = err
        ToReturn.ErrorCode = 10
        throw err;
    }
    else{
        ToReturn.data = result[0]
    }
    // Callback avec le resultat de la requête SQL
    callback(ToReturn);
    } );
    }


function AddUserToDb(mail,password,token,callback) {
    ToReturn = new Object();
    ToReturn.error = GetErrorJson();
    con.query("SELECT * FROM users WHERE email='"+mail+"'", (err, result) => {
        if (err) {
            console.error(err)
            ToReturn.Message = err
            ToReturn.ErrorCode = 10
            throw err;
        }
        else{
            if(result[0] != []) {
                var sql = "INSERT INTO users (email, password, token) VALUES ('"+mail+"', '"+password+"', '"+token+"')";
                con.query(sql, function (err, result) {
                    if (err)
                    {
                        ToReturn.error.ErrorCode = -1
                        ToReturn.error.Message = err
                        throw err
                    }
                    callback(ToReturn)
                });
            }
            else{
                ToReturn.error.ErrorCode = 13
                ToReturn.error.Message = "ErrorSQLInjectError : This user already exist in the DB !"
            }
            
        }
    });
}


module.exports = {
    GetUserInformation: function(mail,pass,callback) {
        GetUserInformation(mail,pass,callback)
    },
    AddUserToDb: function(mail,pass,token,callback) {
        AddUserToDb(mail,pass,token,callback)
    }
}
