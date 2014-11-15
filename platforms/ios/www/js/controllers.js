angular.module('letu.controllers', [])

.controller('AccountCtrl', function($http,$scope,$rootScope,$state,Util) {
	$rootScope.pageTitle = "我的";
	$rootScope.back = true;

	$rootScope.loginStatus = !!Util.getSid() ? 0 : 1;

	$scope.logout = function(){
		Util.removeUser();
		$rootScope.loginStatus = 1;
	}

})

.controller("SigninCtrl",function($scope,$rootScope,$http,Util,$state){

	$scope.search = {
		"user_name": "",
		"password" : "",
		"app" : true
	};

	$scope.submit = function(){
		$scope.error = "";
		$http({
				"url":URL+"account/ajax/login_process/",
				"data":Util.params($scope.search),
				"method":"post",
				"headers":{
					"Content-Type" :  "application/x-www-form-urlencoded;charset=utf-8"
				}
			}).success(function(res){
				if( !res.err ){
					var arr = res.rsm.url.match(/uid-(\d*).*sid-(.*)$/);
					Util.setSid(arr[2]);
					Util.setUid(arr[1]);
					$rootScope.loginStatus = 0;
				}else{
				}
			});
	}

	$scope.qqLogin = function(){
		var qq = window.open('http://www.letubang.com/account/openid/qq_login/', '_blank', 'location=yes');
		qq.addEventListener('loadstart', function(event) {
			var arr = event.url.match(/sid-(\d*).*uid-(.*)$/);
			if( arr && arr.length ){
				Util.setSid(arr[1]);
				Util.setUid(arr[2]);
				$rootScope.loginStatus = 0;
				qq.close();
				$scope.$apply();
			}
		});
	}

})


.controller("RegisterCtrl",function($scope,$rootScope,$http,Util){

	$scope.search = {
		"user_name": "",
		"password" : "",
		"agreement_chk" : true,
		"app": true
	};

	$scope.submit = function(){
		$scope.error = "";
		$http({
				"url":URL+"account/ajax/register_process/",
				"data":Util.params($scope.search),
				"method":"post",
				"headers":{
					"Content-Type" :  "application/x-www-form-urlencoded;charset=utf-8"
				}
			}).success(function(res){
				if( !res.err ){
					var arr = res.rsm.url.match(/uid-(\d*).*sid-(.*)$/);
					Util.setSid(arr[2]);
					Util.setUid(arr[1]);
					$rootScope.loginStatus = 0;
				}else{
					$scope.error = res.err;
				}
			});
	}

})

.controller('ApplyEventsCtrl', function($scope,$http,$rootScope,$stateParams,Util) {

	$rootScope.pageTitle = "参加的活动";

	var uid = Util.getUid(),
			sid = Util.getSid();

	$scope.refreshText = "下拉刷新...";

	$rootScope.back = true;

	$scope.loaded = false;

	$scope.events = [];

	var params = {
		cur_page:1,
		uid:uid,
		app:true
	}

	$scope.getEvents = function(){
		$http.get(API+"event/user_publish/",{params:params}).success(function(res){
				$scope.events = (res.list || []).concat( $scope.events );
				$scope.loaded = true;
				params.cur_page = params.cur_page + 1;
				if(  res.list.length === 0 ){
					$scope.getEvents = function(){$scope.$broadcast('scroll.refreshComplete');};
					$scope.refreshText = "已没有更新内容";
				}
			})
		.finally(function() {
			$scope.$broadcast('scroll.refreshComplete');
		});
	}

	$scope.getEvents();
})

.controller('PublishEventsCtrl', function($scope,$http,$rootScope,$stateParams,Util) {

	$rootScope.pageTitle = "发布的活动";

	$rootScope.back = true;

	var uid = Util.getUid(),
			sid = Util.getSid();

	$scope.refreshText = "下拉刷新...";

	$scope.loaded = false;

	$scope.events = [];

	var params = {
		cur_page:1,
		uid:uid,
		app:true
	}

	$scope.getEvents = function(){
		$http.get(API+"event/user_apply/",{params:params}).success(function(res){
				$scope.events = (res.list || []).concat( $scope.events );
				$scope.loaded = true;
				params.cur_page = params.cur_page + 1;
				if(  res.list.length === 0 ){
					$scope.getEvents = function(){$scope.$broadcast('scroll.refreshComplete');};
					$scope.refreshText = "已没有更新内容";
				}
			})
		.finally(function() {
			$scope.$broadcast('scroll.refreshComplete');
		});
	}

	$scope.getEvents();
})

.controller('DashCtrl', function($scope,$http,$rootScope,$api,$state) {
	$rootScope.pageTitle = "";

	$scope.params = {
    "charge_type" : "",
    "category" : "",
    "filter_time" : "",
    "city":""
  };

	$api("get_hd_chargetype",function(res){
    $scope.chargeTypeList = res;
  });

  $api("get_filter_city",function(res){
    $scope.cityList = res;
  });

  $api("get_hd_category",function(res){
    $scope.category = res;
  });

  $api("get_filter_time",function(res){
    $scope.filterTimeList = res;
  });

	$scope.search = function(){
		$state.go("tab.events",$scope.params);
		return false;
	}
})

.controller('EventsCtrl', function($scope,$http,$rootScope,$stateParams) {

	$rootScope.pageTitle = "活动";

	$scope.refreshText = "下拉刷新...";

	$scope.loaded = false;

	$scope.events = [];

	var params = {
		category:$stateParams.category,
		charge_type:$stateParams.charge_type,
		city:$stateParams.city,
		cur_page:1,
		per_page:10,
		filter_time:$stateParams.filter_name
	}

	$scope.getEvents = function(){
		$http.get(API+"event/list/",{params:params}).success(function(res){
				$scope.events = res.list.concat( $scope.events );
				$scope.loaded = true;
				params.cur_page = +res.pagination.cur_page + 1;
				if(  Math.ceil(res.pagination.total_rows/res.pagination.per_page ) < params.cur_page ){
					$scope.getEvents = function(){$scope.$broadcast('scroll.refreshComplete');};
					$scope.refreshText = "已没有更新内容";
				}
			})
		 .finally(function() {
		   $scope.$broadcast('scroll.refreshComplete');
		 });
	}

	$scope.getEvents();
})

.controller('EventDetailCtrl', function($scope,$rootScope,$state,$http,$sce) {
	$rootScope.pageTitle = "活动详情";

	$rootScope.back = true;

	$scope.toHtml = function( html ) {
		return $sce.trustAsHtml(html);
	};

	$scope.eventId = $state.params.eventId;

	$scope.open = function(url){
		window.open(url, '_blank', 'location=yes');
	}

	$http.post(API+"event/view/"+$state.params.eventId).success(function(res){
		if( res.code === 200 ){
			$scope.userInfo = res.user_info;
			$scope.relList = res.related_list;
			$scope.eventInfo = res.event_info;
			$scope.joinList = res.list_joined;
		}
	});

})

.controller("CheckoutCtrl",function($scope,$rootScope){
	$rootScope.pageTitle = "结算";

})

.controller("ApplyCtrl",function($scope,$rootScope,$state,$http,Util){
	$rootScope.pageTitle = "结算";

	$rootScope.back = true;

	$scope.search = {
		"id" : 114091855648 || $state.params.eventId,
		"number" : 1,
		"username" : "",
		"mobile" : "",
		"remark" : ""
	}

	$scope.confirm = function(){
		$http({
				"url":API+"event/confirm/",
				"data":Util.params($scope.search),
				"method":"post",
				"headers":{
					"Content-Type" :  "application/x-www-form-urlencoded;charset=utf-8"
				}
			}).success(function(res){
				// success
				// $state.go("success");
				// $state.go("");
				if(+res.code === 200){
					// $state.go("success");
				}
			});
	}

})

.controller("SuccessCtrl",function($scope,$rootScope){
	$rootScope.pageTitle = "操作成功";
})

.controller("ListPeopleCtrl",function($scope,$rootScope,$state,$stateParams,Util,$http){
	$rootScope.pageTitle = "人员名单";

	$rootScope.back = true;

	$scope.load = true;

	var params = {
		sid: Util.getSid(),
		id:$stateParams.eventId
	}

	$http.get(API+"event/manage/",{params:params}).success(function(res){
			$scope.list = res.list_user;
			$scope.limit = res.cnt_limit;
			$scope.apply = res.cnt_apply;
			$scope.loaded = true;
	})
})
