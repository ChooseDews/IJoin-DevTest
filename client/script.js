	var ACME = angular.module('ACME', ['ngRoute']);

	// configure our routes
	ACME.config(function($routeProvider,$locationProvider) {
		$locationProvider.html5Mode({
  enabled: true,
  requireBase: false
});
	    $routeProvider.when('/', {
	        templateUrl: 'pages/login.html',
	        controller: 'homeController'
	    }).when('/me', {
	        templateUrl: 'pages/me.html',
	        controller: 'accountController' //me refers to that persons home page
	    }).otherwise({
        redirectTo: '/'
      });
	});
ACME.service('talk', function($http, $location){
	var urlBase = '/api/'
    this.post = function(url,data,callback){
    		$http.post(urlBase+url,data).success(function(payload) {
					if(payload == "NOT AUTHENTICATED"){

							return $location.path('/'); //If we ever get a non auth return take the user back to login

					}
    			callback(payload);
				});
    };
    this.get = function(url,callback){
    	console.log(url);
    		$http.get(urlBase+url).success(function(payload) {
					if(payload == "NOT AUTHENTICATED"){

							return $location.path('/'); //If we ever get a non auth return take the user back to login

					}
    			  callback(payload);

				});
    };

});
	ACME.controller('mainController', function($scope, talk, $location) {
				//Anything the whole app needs can go here!
	});
	ACME.controller('homeController', function($scope, talk, $location) {
			talk.get('me', function(data){
					if(data != 'NOT AUTHENTICATED'){
							return $location.path('/me');
					}
			});
	    $scope.login = function(email,password){
	    		payload = {
	    			username: email,
	    			password: password
	    		};
	    		talk.post('login',payload, function(data){
	    			if(data.error){
    				$scope.error = data.message;
    				}else{
    					 $location.path('/me'); //Post login send them to see there account
    				}
	    		});
	    }
	    var runtime = function() {
	        var height = $(window).innerHeight();
	        var panel = $('#login-panel').outerHeight();
	        var offset = (height - panel) / 2;
	        if (height > panel) {
	            $('.login-panel').css('margin-top', offset);
	        }
	    }
	    $('img.logo').load(function() {
	        runtime();
	    });
	    $(window).resize(function() {
	        runtime();
	    });
	});

	ACME.controller('accountController', function($scope,talk) {
		$scope.loading = true;
				$scope.update = function(me){
					talk.post('update', me, function(data){
						Materialize.toast('Profile Updated', 2000)
					});
				}
	    talk.get('me', function(data){
	    		data.picture = "https://randomuser.me/api/portraits/men/"+Math.floor((Math.random() * 10) + 1)+".jpg"; //Get a more intresting picture using the random user database,
					data.age = Number(data.age);
	    		$scope.me = data;
					$scope.loading = false;
	    		});
	});
