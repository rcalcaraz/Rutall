angular.module('app.controllers', [])
  
.controller('mainCtrl', function($scope) {
})
   
.controller('loginCtrl', function($scope, $location, AuthenticationService) {
	AuthenticationService.ClearCredentials();	
	$scope.credentials = {};

	$scope.login = function(credentials){
		AuthenticationService.Login(credentials.email,credentials.password, function (response) {
	        if (response.success) {
	           AuthenticationService.SetCredentials(credentials.email, credentials.password);
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
		UserService.Create(credentials).then(function (response) {
            if (response.success) {
               	console.log("registration complete");
                $location.path('/login');
            } else {
               	console.log("registration fail");
            }
        });
	};
})
   
.controller('changePasswordCtrl', function($scope) {

})
   
.controller('forgottenPasswordCtrl', function($scope) {

})
   
.controller('newRouteCtrl', function($scope, SearchLocationService, $rootScope, $location) {
	SearchLocationService.CleanLocations();
	$scope.location = {};
	$scope.search = function(location){
		SearchLocationService.GetLocation(location.name);
	};	
	choose = function(index){
		SearchLocationService.ChooseLocation(index);
	}
	removeLocation = function(location,index){
		SearchLocationService.RemoveLocation(index,location);
	}
	$scope.continue = function(){
		SearchLocationService.SaveLocations();
		$location.path('/calculatingRoute');
	}

})
   
.controller('chooseLocationsCtrl', function($scope) {

})
      
.controller('detailedRouteCtrl', function($scope,$rootScope,$location,RouteService,UserService) {
	var precioLitroGasolina = 1.08; // TODO change to save in user profile
	$scope.totalDistance = Math.round($rootScope.globals.currentRoute.route_summary.total_distance/1000);
	$scope.totalHours = Math.floor($rootScope.globals.currentRoute.route_summary.total_time/3600);
	$scope.totalMinutes = Math.round($rootScope.globals.currentRoute.route_summary.total_time%60);
	$scope.totalConsumo = Math.round($scope.totalDistance/100);
	$scope.localizaciones = $rootScope.globals.currentGARoute.chromosome;

	$scope.saveRoute = function(data){
		UserService.GetByEmail($rootScope.globals.currentUser.email).then(function (user) {
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
	UserService.GetByEmail($rootScope.globals.currentUser.email).then(function (user) {
		  RouteService.GetByCreator(user._id).then(function(rutas){
		  	$scope.Math = window.Math;
		  	$scope.rutas = rutas;
		  });
	});

	$scope.selectCurrentRoute = function(routeId){
		RouteService.GetById(routeId).then(function(ruta){
			$rootScope.globals.currentRoute = ruta;
			$location.path('/detailedRoute');
		});
	}
})
   
.controller('welcomeCtrl', function($scope) {
	
})
   
.controller('startCtrl', function($scope, $rootScope, $location, UserService, AuthenticationService) {
	loadCurrentUser();

	function loadCurrentUser() {
        UserService.GetByEmail($rootScope.globals.currentUser.email)
            .then(function (user) {
              $scope.currentUserEmail = user.email;
        });
    }

    $scope.closeSession = function(){
    	$location.path('/login');
    }
})
      
.controller('calculatingRouteCtrl', function($scope,$rootScope,$cookieStore,$location,CalculateRouteService) {
	CalculateRouteService.FindBestRoute().then(function(rutaOSRM){
		$location.path('/detailedRoute');
	});
})
   
.controller('myDataCtrl', function($scope) {

})
 