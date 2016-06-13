angular.module('app.controllers', [])
  
.controller('mainCtrl', function($scope) {
})
   
.controller('loginCtrl', function($scope, $location, AuthenticationService) {
	AuthenticationService.clearCredentials();	
	$scope.credentials = {};

	$scope.login = function(credentials){
		AuthenticationService.login(credentials.email,credentials.password, function (response) {
	        if (response.success) {
	           AuthenticationService.setCredentials(credentials.email, credentials.password);
               $location.path('/welcome');
	        } else {
	           console.log("Login false");
	           $location.path('/');
	        }
	    });
	};
})
   
.controller('signUpCtrl', function($scope, $location, UserService) {
	$scope.credentials = {};

	$scope.signup = function(credentials){
		UserService.create(credentials).then(function (response) {
            if (response.success) {
               	console.log("registration complete");
                $location.path('/login');
            } else {
               	console.log("registration fail");
            }
        });
	};
})
     
.controller('newRouteCtrl', function($scope, SearchLocationService, $rootScope, $location) {
	SearchLocationService.cleanLocations();
	$scope.location = {};
	$scope.search = function(location){
		SearchLocationService.getLocation(location.name);
	};	
	choose = function(index){
		SearchLocationService.chooseLocation(index);
	}
	removeLocation = function(location,index){
		SearchLocationService.removeLocation(index,location);
	}
	$scope.continue = function(){
		SearchLocationService.saveLocations();
		$location.path('/calculatingRoute');
	}
})
      
.controller('detailedRouteCtrl', function($scope,$rootScope,$location,RouteService,UserService) {
	var precioLitroGasolina = 1.08; // TODO change get it from an api
	var consumoMedio = 6; // TODO change to save in user profile
	$scope.totalDistance = Math.round($rootScope.globals.currentRoute.route_summary.total_distance/1000);
	$scope.totalHours = Math.floor($rootScope.globals.currentRoute.route_summary.total_time/3600);
	$scope.totalMinutes = Math.round($rootScope.globals.currentRoute.route_summary.total_time%60);
	$scope.totalConsumo = Math.round($scope.totalDistance*precioLitroGasolina*consumoMedio/100);
	$scope.localizaciones = $rootScope.globals.currentGARoute.chromosome;

	$scope.saveRoute = function(data){
		UserService.getByEmail($rootScope.globals.currentUser.email).then(function (user) {
	    	var ruta = {};
			ruta.creator = user._id;
			ruta.name = data.name;
			ruta.time = $rootScope.globals.currentRoute.route_summary.total_time;
			ruta.distance = $scope.totalDistance;
			ruta.consumption = $scope.totalConsumo;
			ruta.locations = $scope.localizaciones;
			RouteService.Create(ruta);
			$location.path('/start');
	    });
   	}
})
   
.controller('myRoutesCtrl', function($scope, $rootScope, $location, UserService, RouteService) {
	UserService.getByEmail($rootScope.globals.currentUser.email).then(function (user) {
		  RouteService.getByCreator(user._id).then(function(rutas){
		  	$scope.Math = window.Math;
		  	$scope.rutas = rutas;
		  });
	});

	$scope.selectCurrentRoute = function(routeId){
		RouteService.getById(routeId).then(function(ruta){
			$rootScope.globals.currentRoute = ruta;
			$location.path('/myRouteDetail');
		});
	}
})
  
.controller('startCtrl', function($scope, $rootScope, $location, UserService, AuthenticationService) {
	loadCurrentUser();

	function loadCurrentUser() {
        UserService.getByEmail($rootScope.globals.currentUser.email)
            .then(function (user) {
              $scope.currentUserEmail = user.email;
        });
    }

    $scope.closeSession = function(){
    	$location.path('/login');
    }
})
      
.controller('calculatingRouteCtrl', function($scope,$rootScope,$cookieStore,$location,CalculateRouteService) {
	CalculateRouteService.findBestRoute().then(function(rutaOSRM){
		if(rutaOSRM==false){
			$location.path('/errorRoute');
		}
		else{
			$location.path('/detailedRoute');
		}		
	});
})

.controller('myRouteDetailCtrl', function($scope,$rootScope) {
	console.log($rootScope.globals.currentRoute);
	$scope.totalDistance = Math.round($rootScope.globals.currentRoute.distance);
	$scope.totalHours = Math.floor($rootScope.globals.currentRoute.time/3600);
	$scope.totalMinutes = Math.round($rootScope.globals.currentRoute.time%60);
	$scope.totalConsumo = Math.round($scope.totalDistance/100);
	$scope.localizaciones = $rootScope.globals.currentRoute.locations;
})
   
.controller('myDataCtrl', function($scope) {
})
 
.controller('errorRouteCtrl', function($scope) {
})

.controller('changePasswordCtrl', function($scope) {
})

.controller('welcomeCtrl', function($scope) {
})

