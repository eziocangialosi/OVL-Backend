var mysql = require('mysql') // Required for the REST API to work.
var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "Pornhub",
    database: "Test"
  });

async function GetErrorJson() {
    let ErrorJson = new Object()
    ErrorJson.ErrorCode = 0
    ErrorJson.Message = "Nothing went wrong"
    return ErrorJson
}


async function GetUserInformation(mail,pass) {
    ToReturn = new Object();
    ToReturn.error = await GetErrorJson();
    con.connect((err) => {
        if (err)
        {
            ToReturn.error.ErrorCode = -1
            ToReturn.error.Message = err
            console.log(err)
            //throw err
	        return ToReturn
        }
        con.query("SELECT * FROM Test WHERE mail='"+mail+"' AND password='"+pass+"'", (err, result) => {
            if (err)
            {
                ToReturn.error.ErrorCode = -1
                ToReturn.error.Message = err
                console.log(err)
                //throw err
		    return ToReturn
            }
            console.log(result)
            ToReturn.data = result[0].RowDataPacket
            return ToReturn
        });
      });
    //return ToReturn
}


function AddUserToDb(mail,password) {
    ToReturn = new Object();
    ToReturn.error = GetErrorJson();
    con.connect(function(err) {
        if (err)
        {
            ToReturn.error.ErrorCode = -1
            ToReturn.error.Message = err
            throw err
        }
        var sql = "INSERT INTO Test (mail, password) VALUES ('"+mail+"', '"+password+"')";
        con.query(sql, function (err, result) {
            if (err)
            {
                ToReturn.error.ErrorCode = -1
                ToReturn.error.Message = err
                throw err
            }
        });
      });
    return ToReturn
}


module.exports = {
    GetUserInformation: async function(mail,pass) {
        await GetUserInformation(mail,pass)
    },
    AddUserToDb: function(mail,pass) {
        AddUserToDb(mail,pass)
    }
}
