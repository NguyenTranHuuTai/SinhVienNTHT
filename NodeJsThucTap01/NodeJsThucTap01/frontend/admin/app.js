//Khởi tạo ứng dựng angularjs với tên module là admin,sử dụng ngRoute và datatables
var app = angular.module("admin", ['ngRoute', 'datatables']);

//single pages aplication click vào menu sẽ load nội dung page tương ứng 
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "pages/main.html"	
    })
    .when("/taikhoan", {
        templateUrl : "pages/users.html",
        controller : "users"		
    })
    .when("/quicach", {
        templateUrl : "pages/product_specifications.html"
    })
    .when("/nhacungcap", {
        templateUrl : "pages/suppliers.html"
    })
	.when("/loai", {
        templateUrl : "pages/product_categories.html"
    })
	.when("/nhom", {
        templateUrl : "pages/product_groups.html"
    })
	.when("/khachhang", {
        templateUrl : "pages/customers.html"
    })
	.when("/sanpham", {
        templateUrl : "pages/products.html"
    })
	.when("/donvitinh", {
        templateUrl : "pages/calculation_units.html"
    })
	.when("/mamau", {
        templateUrl : "pages/color_codes.html"
    })
	.when("/donhang", {
        templateUrl : "pages/orders.html"
    }).when("/phanhoi", {
        templateUrl : "pages/feedbacks.html"
    });
});

//khởi tạo controller với tên là users dùng để thêm,sủa,xóa tài khoản
app.controller('users', function($scope,$http,DTOptionsBuilder,$window) {
	
	//hàm load tài khoản từ server
	$scope.Get_Users=function(){		
		$http({
		  method: 'GET',
		  url: 'http://localhost:3000/users',		  
		}).then(function (response) {			
			console.log(response.data);
            $scope.list_users = response.data;			
		  }, function (response) {
			console.log(response);
            $window.alert("Đã xảy ra lỗi với server không lấy được data");
		  });
	};
	
	//chạy hàm khi load trang
    $scope.Get_Users();
	
	//cấu hình angular datatables
    $scope.dtOptions = DTOptionsBuilder.newOptions()
		 .withLanguage({
			"sEmptyTable":     "Không có dữ liệu nào trong bảng",
			"sInfo":           "Đang xem _START_ đến  _END_ trong tổng số _TOTAL_ mục",
			"sInfoEmpty":      "Đang xem 0 đến  0 trong tổng số 0 mục",
			"sInfoFiltered":   "(được lọc từ _MAX_ mục)",
			"sInfoPostFix":    "",
			"sInfoThousands":  ",",
			"sLengthMenu":     "Xem  _MENU_ mục",
			"sLoadingRecords": "Đang tải...",
			"sProcessing":     "Đang xử lý...",
			"sSearch":         "Tìm:",
			"sZeroRecords":    "Không tìm thấy dòng nào phù hợp",
			"oPaginate": {
				"sFirst":    "Đầu",
				"sLast":     "Cuối",
				"sNext":     "Tiếp",
				"sPrevious": "Trước"
			},
			"oAria": {
				"sSortAscending":  ": activate to sort column ascending",
				"sSortDescending": ": activate to sort column descending"
					}
		})
		.withPaginationType('full_numbers')
		.withDisplayLength(5).withOption('lengthMenu', [[5, 10, 15, 20, 50, 100,-1],[5, 10, 15, 20, 50,100,"Tất cả"]]);       
     
	 //hàm chọn row để biết đang chọn row nào
    $scope.select_user=function(user){	 
		$scope.current_selected_user=user;//lưu đối tượng của row đang chọn vào $scope.current_selected_user để load lên form sủa
	};
	
	//hàm thêm tài khoản Users_Modal_Add 
    $scope.Add_User = function(){		
		var add_user_obj = {
			username: $('#A_txtUsername').val(),
			password : $('#A_txtPassword').val(),
			hoten : $('#A_txtHoten').val(),
			sdt : $('#A_txtSdt').val(),
			email : $('#A_txtEmail').val(),
			};
		
	    $http({
		  method: 'POST',
		  url: 'http://localhost:3000/users',
		  data: add_user_obj
		}).then(function successCallback(response) {			
			$scope.Get_Users();
			$window.alert(response.data.message);
			
		  }, function errorCallback(response) {
			$window.alert(response.data.message);			
		  });
			
	};
	
	//hàm sửa tài khoản Users_Modal_Edit
    $scope.Edit_User = function(){	      
		$http({
			  method: 'PUT',
			  url: 'http://localhost:3000/users/'+ $('#E_txtId').val(),
			  data: update_user_form_ToJSON()
			}).then(function successCallback(response) {				
				$scope.Get_Users();
				$window.alert(response.data.message);
			  }, function errorCallback(response) {				
				$window.alert(response.data.message);
			  });
  };
	
   //hàm xóa tài khoản Users_Modal_Delete
    $scope.Delete_User = function(){
        $http({
		  method: 'DELETE',
		  url: 'http://localhost:3000/users/' + $('#D_txtId').val(),		  
		}).then(function (response) {			
			$scope.Get_Users();
			$window.alert("Xóa thành công");
			
		  }, function (response) {
			$window.alert("Xóa thất bại");
			console.log(response);
		  });   
	};
	  
  // Helper function to serialize all the form fields into a JSON string
	  function update_user_form_ToJSON(){
		  return JSON.stringify({		 
			  "username": $('#E_txtUsername').val(),
			  "password": $('#E_txtPassword').val(),
			  "hoten": $('#E_txtHoten').val(),
			  "sdt": $('#E_txtSdt').val(),
			  "email": $('#E_txtEmail').val()
			  });
	  }
});


