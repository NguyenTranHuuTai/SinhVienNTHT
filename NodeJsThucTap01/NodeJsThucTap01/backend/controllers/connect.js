var mysql = require("mysql");
var db_config={
	connectionLimit: 10,
    host: "localhost", 
    user: "root",
    password: "",
    database: "thuctap",
    charset: 'utf8mb4',
	multipleStatements : true
};

var pool  = mysql.createPool(db_config);
var connect={
    ConnectMainServer:function (callback) {
        pool.getConnection(function(err, connection) {
            callback(connection);
            connection.release();			
			connection.on('error', function (err) {
                console.log("Loi"+err);
				connection.release();		
                return;
            });
        });
		
    }
};
module.exports=connect;
