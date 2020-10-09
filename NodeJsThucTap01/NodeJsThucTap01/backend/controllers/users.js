var express = require('express')
  , router = express.Router();
var core=require('./core');
var connect=require('./connect');



router.get('/',function(req,res){	//lấy tất cả user
  connect.ConnectMainServer(function (connection) {
  connection.query("SELECT * FROM taikhoan", function (err, result, fields) {
		if (err) throw err;
		res.send(result);
		}); 
  }); 
});
 
router.post('/',function(req,res){  //thêm user 
	if(!req.body.username && !req.body.password ){
		return res.json({
			message: 'Username và password không được trống',
			error: true
		});
	}
	else if(!req.body.username ){
		return res.json({
			message: 'Username không được trống',
			error: true
		});
	}else if(!req.body.password ){
		return res.json({
			message: 'Password không được trống',
			error: true
		});
	}
	connect.ConnectMainServer(function (connection) {
	var querycheck = "select COUNT(*) AS numrows  from taikhoan where username= ? ";
	connection.query(querycheck,[req.body.username], function (err, rows) {
	if(rows[0].numrows>0)
	{
		return res.json({
			message: 'Username đã tồn tại',
			error: true
		});
	}
	else{
	var sql = "INSERT INTO taikhoan(username,password,hoten,sdt,email)  VALUES ('"+req.body.username+"', '"+req.body.password+"', '"+req.body.hoten+"', '"+req.body.sdt+"', '"+req.body.email+"')";
	connection.query(sql, function (err, result) {
		if (err) throw err;
		console.log("1 record inserted");
		});
		return res.json({
			message: 'Thêm thành công',
			error: false
		});
	}
	  });
	  });
});

router.put('/:id',function(req,res){//cập nhật user theo id
	if(!req.body.username || !req.body.password ){
		return res.json({
			message: 'Username và password không được trống',
			error: true
		});
	}
	connect.ConnectMainServer(function (connection) {
	var query1 = "select * from taikhoan where id= ?";	
	connection.query(query1,[req.params.id], function (err, rows) {
		if(rows[0].username==req.body.username){//username cũ giống username mới nên ko cần update username
			var sql = "UPDATE taikhoan SET password='"+req.body.password+"',hoten='"+req.body.hoten+"',sdt='"+req.body.sdt+"',email='"+req.body.email+"' WHERE id='"+req.params.id+"'";
			connection.query(sql, function (err, result) {
			if (err) throw err;
			console.log("1 record updated");
            return res.json({
				message: 'Cập nhật thành công',
				error: false
				
			});			
			});		
				
	    }else{//username mới khác username cũ
			var query2 = "select COUNT(*) AS numrows  from taikhoan where username= ? ";//tìm username cần update có trùng ko
			connection.query(query2,[req.body.username], function (err, rows) {
				if(rows[0].numrows>0)//trùng với username của tài khoản khác
				{
					return res.json({
						message: 'Username đã tồn tại',
						error: true
					});
				}else{
					var sql = "UPDATE taikhoan SET username='"+req.body.username+"',password='"+req.body.password+"',hoten='"+req.body.hoten+"',sdt='"+req.body.sdt+"',email='"+req.body.email+"' WHERE id='"+req.params.id+"'";
					connection.query(sql, function (err, result) {
					if (err) throw err;
					console.log("1 record updated");
                    return res.json({
						message: 'Cập nhật thành công',
						error: false
					});					
					});								
				}
			});
		}
		
	});
	
	});
});

router.delete('/:id',function(req,res){//xóa user theo id
	connect.ConnectMainServer(function (connection) {
	var sql = "DELETE from taikhoan WHERE id='"+req.params.id+"'";
	connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record deleted");
	return res.json({
		message: 'Xóa thành công',
		error: false
	});
    });		   	
	});
});

router.get('/:id',function(req,res){//lấy 1 user
	connect.ConnectMainServer(function (connection) {
	connection.query("SELECT * FROM taikhoan where id='"+req.params.id+"'", function (err, result, fields) {
    if (err) throw err;
    res.send(result);
    });
	});
});


module.exports = router;