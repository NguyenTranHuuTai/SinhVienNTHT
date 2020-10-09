//var moment=require('moment');
var code= {
    getfield: function (table) {
	
        var field_user = [  
			"id",		
            "username",
            "password",
            "hoten",
			"sdt",
			"email"
           
        ];
		//tên giống tên field table
		//var field_khoa=[
			//"makhoa",
			//"tenkhoa"
		//]

        switch (table) {
            case "taikhoan":
                return field_user;
                break;
			//case "khoa":
               // return field_khoa;
               // break;
            
				
        }
    },
    allDataRequestExist: function (datareq, array) {
        for (i in array) {
            var checkexist = false;
            // console.log(array[i]);
            for (j in datareq) {
                if (j == array[i]) {
                    checkexist = true;
                    break;
                }
            }
            if (!checkexist) {
                return false;
                break;
            }
        }
        return true;
    },
    fetchFieldsIfExist: function (arrayfield, datareq) {
        var data = {};
        for (i in datareq) {
            for (j in arrayfield) {
                if (i == arrayfield[j]) {
                    data[i] = datareq[i];
                    break;
                }
            }
        }
        return data;
    },

    getDate: function (str) {//lấy ngày giờ từ chuổi timestamp
        var date = new Date(str);
        var d = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var m = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
        var y = date.getFullYear() < 10 ? "0" + date.getFullYear() : date.getFullYear();
        return d + "/" + m + "/" + y;
    },
    getDateTime: function (str) {//lấy ngày giờ từ chuổi timestamp
        var date = new Date(str);
        var d = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var m = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
        var y = date.getFullYear() < 10 ? "0" + date.getFullYear() : date.getFullYear();
        var h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var mu = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        var ss = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        return d + "-" + m + "-" + y + " " + h + ":" + mu + ":" + ss
    },
    getDateNow: function () {
        return new Date().setHours(0, 0, 0, 0).toString().replace("00000", "");
    },
    getDateTimeNow: function () {
        var date = new Date();
        var d = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var m = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
        var y = date.getFullYear() < 10 ? "0" + date.getFullYear() : date.getFullYear();
        var h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var mu = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        return d + "-" + m + "-" + y + " " + h + ":" + mu
    },
    decodeDateFromString: function (stringDateMillisecond) {
        return new Date(parseInt(stringDateMillisecond) * 1000000);
    },
    randomcharacters: function (number) {
        var text = "";
        var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < number; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    },
    randomnumber: function (number) {
        var text = "";
        var possible = "0123456789";

        for (var i = 0; i < number; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    },
    data: function (datares, code, message) {
        if (datares == undefined) {
            datares = {};
        }
        return {
            data: datares,
            code: code,
            message: message
        }
    },
    checkSession: function (req, res, next) {
        if (req.session.user != undefined) {
            next();
        } else {
            res.send(code.nologin());
        }
    },
    checkSessionSchedules: function (req, res, next) {
        if (req.session.user != undefined) {
            next();
        } else if (req.session.useroftour != undefined) {
            if (req.session.useroftour.permission == 0) {
                res.send(code.nopermission());
            } else {
                next();
            }
        } else {
            res.send(code.nologin());
        }
    },
    checkSessionUser: function (req, res, next) {
        console.log(req.session.user);
        if (req.session.user != undefined) {
            if (req.session.user.permission == 3) {
                next();
            }
            else {
                res.send(code.nopermission());
            }
        } else {
            res.send(code.nologin());
        }
    },
    checkSessionAdmin: function (req, res, next) {
        if (req.session.user != undefined) {
            if (req.session.user.permission == 1) {
                next();
            }
            else {
                res.send(code.nopermission());
            }
        } else {
            res.send(code.nologin());
        }
    },
    checkSessionManager: function (req, res, next) {
        if (req.session.user != undefined) {
            if (req.session.user.permission == 2) {
                next();
            }
            else {
                res.send(code.nopermission());
            }
        } else {
            res.send(code.nologin());
        }
    },
    checkSessionRoot: function (req, res, next) {
        if (req.session.user != undefined) {
            if (req.session.user.permission == 0) {
                next();
            }
            else {
                res.send(code.nopermission());
            }
        } else {
            res.send(code.nologin());
        }
    },
    convertDateToMilisecond: function (data) {
        if (data instanceof Array) {
            for (i in data) {
                data[i] = code.convertDateToMilisecond(data[i]);
            }
            return data;
        }
        if (data instanceof Object) {
            for (i in data) {
                if (data[i] instanceof Date) {
                    if (i != "birthday") {
                        data[i] = data[i].getTime();
                    } else {
                        data[i] = moment(data[i]).format('DD-MM-YYYY');
                    }
                }
            }
            return data;
        }
    },
    getUsernameFromReqSession: function (req) {
        if (req.session.user) {
            return req.session.user.username;
        }
        else if (req.session.useroftour) {
            return req.session.useroftour.username;
        }
    },
    getUserFromReqSession: function (req) {
        if (req.session.user) {
            return req.session.user;
        } else {
            return undefined;
        }

    },
    openMyRoom: function (id) {
        return "Room-user-" + id;
    },
    openTourRoom: function (id) {
        return "Room-tour-" + id;
    },
    success: function (data) {
        return code.data(data, "1000");
    },
    fail: function (data) {
        return code.data(data, "1001");
    },
    exist: function (data) {
        return code.data(data, "1002");
    },
    notexist: function (data) {
        return code.data(data, "1003");
    },
    nonedata: function (data) {
        return code.data(data, "1004");
    },
    nopermission: function (data) {
        return code.data(data, "1005");
    },
    toolimited: function (data) {
        return code.data(data, "1006");
    },
    nologin: function (data) {
        return code.data(data, "9998");
    },
    error: function (data) {
        return code.data(data, "9999");
    },
    nofinish: function (data) {
        return code.data(data, "8888");
    }
};
Number.isInteger = Number.isInteger || function(value) {
        return typeof value === 'number' &&
            isFinite(value) &&
            Math.floor(value) === value;
    };
module.exports=code;
