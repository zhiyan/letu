angular.module('letu.services', [])

.filter("dateFormat",function(){
	return function(input){
		if( !/\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}/.test(input) ) return input;
		var sp = input.split(" ");
			arr = sp[0].split("-"),
			time = sp[1].split(":");
		return arr[1]+"/"+arr[2]+" "+time[0]+":"+time[1];
	}
})

.factory("$api",function($http){
  return function(method,params,fn){
    if( typeof params === "function" ){
      fn = params;
      params = {};
    }
    params = params || {};
    params.method = method;
    $http.post(API,params).success(fn);
    }
})


.factory('Util', function() {
  // Might use a resource here that returns a JSON array

  return {
    params: function( obj ) {
      var res = "";
      angular.forEach(obj,function(v,i){
        res += "&"+i + "=" + v;
      })
      return res.slice(1);
    },
		getSid: function(){
			return window.localStorage["sid"];
		},
		setSid: function(sid){
			window.localStorage["sid"] = sid;
		},
		removeUser: function(sid){
			window.localStorage.removeItem("sid");
			window.localStorage.removeItem("uid");
		},
		getUid: function(){
			return window.localStorage["uid"];
		},
		setUid: function(sid){
			window.localStorage["uid"] = sid;
		}
  }
});
