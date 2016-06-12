    var app = angular.module('app.services', ['ngCookies']);

    // Base64 encoding service used by AuthenticationService
    var Base64 = {

        keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    this.keyStr.charAt(enc1) +
                    this.keyStr.charAt(enc2) +
                    this.keyStr.charAt(enc3) +
                    this.keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = this.keyStr.indexOf(input.charAt(i++));
                enc2 = this.keyStr.indexOf(input.charAt(i++));
                enc3 = this.keyStr.indexOf(input.charAt(i++));
                enc4 = this.keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };

    // Route service ========================

    app.factory("RouteService",function($http, $q){
        var service = {};

        service.GetAll = GetAll;
        service.GetByCreator = GetByCreator;
        service.GetById = GetById;
        service.Create = Create;

        return service;

        function GetAll() {
            return $http.get('/api/routes').then(handleSuccess, handleError('Error getting all routes'));
        }

        function GetByCreator(idCreator) {
            return $http.get('/api/routes/creator/' + idCreator).then(handleSuccess, handleError('Error getting routes by creator'));
        }

        function GetById(routeId){
            return $http.get('/api/routes/' + routeId).then(handleSuccess, handleError('Error getting routes by creator'));
        }

        function Create(route) {
            Add(route);
        }

        // private functions

        function Add(route) {
            return $http.post('/api/routes', route).then(handleSuccess, handleError('Error creating route'));
        }

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    });


    // User service ========================

    app.factory("UserService",function($http, $q){
        var service = {};

        service.GetAll = GetAll;
        service.GetByEmail = GetByEmail;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetAll() {
            return $http.get('/api/users').then(handleSuccess, handleError('Error getting all users'));
        }

        function GetByEmail(email) {
            return $http.get('/api/users/' + email).then(handleSuccess, handleError('Error getting user by email'));
        }

        function Create(user) {
            var deferred = $q.defer();

            GetByEmail(user.email).then(function (duplicateUser) {
                    if (duplicateUser !== null) {
                        deferred.resolve({ success: false, message: 'Username "' + user.email + '" is already taken' });
                    } else {
                        Add(user);
                        deferred.resolve({ success: true });
                    }
                });

            return deferred.promise;        
        }

        function Update(user) {
            return $http.put('/api/users/' + user.id, user).then(handleSuccess, handleError('Error updating user'));
        }

        function Delete(id) {
            return $http.delete('/api/users/' + id).then(handleSuccess, handleError('Error deleting user'));
        }

        // private functions

        function Add(user) {
            return $http.post('/api/users', user).then(handleSuccess, handleError('Error creating user'));
        }

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    });

    // Authentication service =====================

    app.factory("AuthenticationService",function($http, $cookieStore, $rootScope, UserService){
        var service = {};

        service.Login = Login;
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;

        return service;

        function Login(email, password, callback) {

         UserService.GetByEmail(email).then(function (user) {
                if (user !== null && user.password === password) {
                    response = { success: true };
                } else {
                    response = { success: false, message: 'Username or password is incorrect' };
                }
                callback(response);
            });
        }

        function SetCredentials(email, password) {
            var authdata = Base64.encode(email + ':' + password);

            $rootScope.globals.currentUser = {
                    email: email,
                    authdata: authdata
            };

            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
            $cookieStore.put('globals', $rootScope.globals);
        }

        function ClearCredentials() {
            $rootScope.globals = {};
            $cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic';
        }
    });

    // Calculate Route Service =====================

    app.factory("CalculateRouteService",function($http,$rootScope,$q){
        var service = {};

        service.FindBestRoute = FindBestRoute;

        function FindBestRoute(){
            ClearCurrentRoute();
            var bestRoute = $q.defer();
            FindBestGeneticAlgorithmRoute().then(function(rutaGA){
                $rootScope.globals.currentGARoute = rutaGA;
                CalculateRouteDistance(rutaGA).then(function(rutaOSRM){
                    $rootScope.globals.currentRoute = rutaOSRM;
                    bestRoute.resolve(rutaOSRM);
                })
            });
            return bestRoute.promise;
        }
       
        // private functions

        function ClearCurrentRoute() {
            $rootScope.globals.currentRoute = {};
            $rootScope.globals.currentGARoute = {};
            //$cookieStore.remove('currentRoute');
        }
        function FindBestGeneticAlgorithmRoute(){
            var bestRoute = $q.defer();
            var locations = $rootScope.globals.routeLocations; 
            var coordinatesString = getCoordinatesString(locations);
            getTimeTable(coordinatesString).done(function(data){
                // TODO Buscar nodos mas cercanos 
                // TODO Checkear rutas null
                var distanceTable = getJsonTimeTable(locations,data);
                $.getScript("js/geneticAlgorithm.js",function(){
                    $.getScript("js/configuration.js",function(){
                        // CONFIGURATION OF THE GA
                        configuration.tabla = distanceTable;
                        configuration.chromosomeSize = setGenes(locations).length;
                        configuration.genes = setGenes(locations);
                        // RUN THE GA
                        var ga = new GeneticAlgorithm(configuration);
                        ga.initialize();
                        ga.simulateConditionalTime(1500); 
                        bestRoute.resolve(ga.getBest());                                                
                    });
                });
            });
            return bestRoute.promise;
        }

        function CalculateRouteDistance(data){
            var bestRoute = $q.defer();
            var coordinates = getCoordinatesFromLocations(data,$rootScope.globals.routeLocations);           
            var query = getOSRMviaRouteQuery(coordinates);
            getOSRMRoute(query).done(function(route){
                bestRoute.resolve(route);
            });
            return bestRoute.promise;     
        }

        function setGenes(locations){
            var genes = [];
            for(var i=0; i<locations.length; i++){
                genes.push(locations[i].display_name);
            }
            return genes;
        }

        function getCoordinatesFromLocations(data,locations){
            var coordinates = [];
            for(var i=0; i<data.chromosome.length; i++){
               for(var j=0; j<locations.length; j++){
                    if(locations[j].display_name == data.chromosome[i]){
                        coordinates[i] = locations[j].lat + "," + locations[j].lon;
                    }
               }
            }   
            return coordinates;
        }

        function getJsonTimeTable(locations,timeTable){
            var distanceTable = {};
            for(var i=0;i<locations.length;i++){
                distanceTable[locations[i].display_name] = getJsonDistancesRow(i,locations[i],locations,timeTable);
            }
            return distanceTable;
        }

        function getJsonDistancesRow(index,location,locations,timeTable){
            var jsonDistances = {"distances" : [] };

            for(var i=0; i<locations.length; i++){
                jsonDistances.distances[locations[i].display_name] = {"distance" : timeTable.durations[index][i]};
            }
            return jsonDistances;
        }

        function getCoordinatesString(locations){
            var coordinatesString = '';
            for(var i = 0; i<locations.length-1; i++){
                coordinatesString += locations[i].lat + ',' + locations[i].lon + ';';
            }
            coordinatesString += locations[locations.length-1].lat + ',' + locations[locations.length-1].lon;
            return coordinatesString;
        }

        function getTimeTable(coordinatesString){
            return $.getJSON('http://router.project-osrm.org/table/v1/driving/' + coordinatesString);
        }

        function getDistance(locationA,locationB){
            return $.getJSON('http://router.project-osrm.org/viaroute?loc=' + locationA + '&loc=' + locationB);
        }

        function getConfiguration(){
            return $.getScript("js/configuration.js");
        }

        function getOSRMviaRouteQuery(coordinates){
            var query = 'http://router.project-osrm.org/viaroute?';
            for(var i=0; i<coordinates.length; i++){
                query += 'loc=' + coordinates[i] + '';
            }
            query += '&geometry=true';
            query += '&instructions=true';
            return query;
        }

        function getOSRMRoute(query) {
            return $.getJSON(query).done(handleSuccess).fail(handleError('Error getting OSRM route'));
        }

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }

        return service;
    });


    // Search Location Service =====================

    app.factory("SearchLocationService",function($http, $rootScope,$cookieStore){
        var service = {};
        var searchResults = [];
        var choosenLocations = [];
        var i = 0;

        service.GetLocation = GetLocation;
        service.ChooseLocation = ChooseLocation;
        service.RemoveLocation = RemoveLocation; 
        service.SaveLocations = SaveLocations;
        service.CleanLocations = CleanLocations;

        return service;

        function CleanLocations(){
            $rootScope.globals.routeLocations = {};
            choosenLocations = [];
        }

        function SaveLocations(){
            $rootScope.globals.routeLocations = choosenLocations;
        }

        function RemoveLocation(index,location){
           choosenLocations.splice(searchLocationIndex(choosenLocations,location),1);
           deleteLocationLi(index);
        }

        function ChooseLocation(index){
            choosenLocations.push(searchResults[index]);
            addChoosenLocationLi(createLocationLi(i++,searchResults[index]));
        }

        function GetLocation(name, callback) {
            getNominatimInfo(name).then(function (data){
                searchResults = [];
                clearResults();
                data.forEach(saveAndPrintResult);
            });
        }

        // private functions

        function searchLocationIndex(array,location){
            for(var i= 0; i<array.length; i++){                
                if(array[i].display_name==location){
                    return i;
                }
            }
            return -1;
        }

        function createLocationLi(index,location){
            return '<li id="location' + index + '">\
                        <div class="row">\
                            <div class="col col-10 locationIcon"><img src="img/locationIcon.png" alt="Localizacion" /></div>\
                            <div class="col col-80 localizacion">' + location.display_name + '<br /><span class="position">' + location.lat + ', ' + location.lon + '</span></div>\
                            <div class="col col-10 "><i class="icon ion-trash-b" onclick="removeLocation(' + "'" + location.display_name +  "'" + ',this.parentNode.parentNode.parentNode.id)"></i></div>\
                        </div>\
                    </li>';
        }

        function addChoosenLocationLi(locationLi){
            $('#choosenLocations').append(locationLi);
        }

        function deleteLocationLi(id){
            $('#' + id).empty();
        }

        function saveAndPrintResult(item,index){
            searchResults.push(item);
            addLocationResult(createButton(index,item));
        }

        function clearResults(){
            $('#searchResults').empty();
        }

        function createButton(index,location){
            return '<button id="' + index + '" class="button buttonRutallWhite searchLocationResult" onclick="choose(this.id)">' + location.display_name + ' (' + location.type + ') ' +  '</button>'
        }

        function addLocationResult(locationButton){
            $('#searchResults').append(locationButton);
        }

        function getNominatimInfo(name){
            return $http.get('http://nominatim.openstreetmap.org/search?format=json&limit=5&q=' + name).then(handleSuccess, handleError('Error accessing nominatim API'));
        }

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    });
