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

		$scope.picture = "https://randomuser.me/api/portraits/men/"+Math.floor((Math.random() * 10) + 1)+".jpg"; //Get a more intresting picture using the random user database,

				formatMe = function(data){
					data.age = Number(data.age); //Make the data easier to handle for angular;
					return data
				}


				$scope.update = function(me){
					talk.post('update', me, function(data){
						Materialize.toast('Profile Updated', 2000)
					});
				}
				$scope.finish = function(me){              //Final Check to make sure everything is good
					talk.post('update', me, function(data){
						Materialize.toast('Everything Saved', 2000);
						data = formatMe(data);
						$scope.me = data;
						$scope.edit = false;
					});
				}
	    talk.get('me', function(data){
	    		data = formatMe(data);
	    		$scope.me = data;
					$scope.loading = false;
	    		});
	});





ACME.directive('phoneInput', function($filter, $browser) {   //Make the phone number look all pretty when typing it in
    return {
        require: 'ngModel',
        link: function($scope, $element, $attrs, ngModelCtrl) {
            var listener = function() {
                var value = $element.val().replace(/[^0-9]/g, '');
                $element.val($filter('tel')(value, false));
            };
            // This runs when we update the text field
            ngModelCtrl.$parsers.push(function(viewValue) {
                return viewValue.replace(/[^0-9]/g, '').slice(0,10);
            });
            // This runs when the model gets updated on the scope directly and keeps our view in sync
            ngModelCtrl.$render = function() {
                $element.val($filter('tel')(ngModelCtrl.$viewValue, false));
            };
            $element.bind('change', listener);
            $element.bind('keydown', function(event) {
                var key = event.keyCode;
                // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
                // This lets us support copy and paste too
                if (key == 91 || (15 < key && key < 19) || (37 <= key && key <= 40)){
                    return;
                }
                $browser.defer(listener); // Have to do this or changes don't get picked up properly
            });

            $element.bind('paste cut', function() {
                $browser.defer(listener);
            });
        }
    };
});
ACME.filter('tel', function () {
    return function (tel) {
        if (!tel) { return ''; }
        var value = tel.toString().trim().replace(/^\+/, '');
        if (value.match(/[^0-9]/)) {
            return tel;
        }
        var country, city, number;
        switch (value.length) {
            case 1:
            case 2:
            case 3:
                city = value;
                break;

            default:
                city = value.slice(0, 3);
                number = value.slice(3);
        }
        if(number){
            if(number.length>3){
                number = number.slice(0, 3) + '-' + number.slice(3,7);
            }
            else{
                number = number;
            }

            return ("(" + city + ") " + number).trim();
        }
        else{
            return "(" + city;
        }
    };
});
