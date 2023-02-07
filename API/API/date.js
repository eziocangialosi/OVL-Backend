
module.exports = {
    GetDate: function () {
        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        return (date + "-" + month + "-" + year);
    },
    GetTime: function () {
        let date_ob = new Date();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();
        return (hours + ":" + minutes + ":" + seconds)
    },
    GetTimestamp: function() {
        return Date.now();
    }
}