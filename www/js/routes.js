angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider  

  .state('main', {
    cache: false,
    url: '/main',
    templateUrl: 'templates/main.html',
    controller: 'mainCtrl'
  })

  .state('login', {
    cache: false,
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('signUp', {
    cache: false,
    url: '/signUp',
    templateUrl: 'templates/signUp.html',
    controller: 'signUpCtrl'
  })

  .state('changePassword', {
    cache: false,
    url: '/changePassword',
    templateUrl: 'templates/changePassword.html',
    controller: 'changePasswordCtrl'
  })

  .state('newRoute', {
    cache: false,
    url: '/newRoute',
    templateUrl: 'templates/newRoute.html',
    controller: 'newRouteCtrl'
  })

  .state('detailedRoute', {
    cache: false,
    url: '/detailedRoute',
    templateUrl: 'templates/detailedRoute.html',
    controller: 'detailedRouteCtrl'
  })

  .state('myRoutes', {
    cache: false,
    url: '/myRoutes',
    templateUrl: 'templates/myRoutes.html',
    controller: 'myRoutesCtrl'
  })

  .state('welcome', {
    cache: false,
    url: '/welcome',
    templateUrl: 'templates/welcome.html',
    controller: 'welcomeCtrl'
  })

  .state('start', {
    cache: false,
    url: '/start',
    templateUrl: 'templates/start.html',
    controller: 'startCtrl'
  })

  .state('calculatingRoute', {
    cache: false,
    url: '/calculatingRoute',
    templateUrl: 'templates/calculatingRoute.html',
    controller: 'calculatingRouteCtrl'
  })

  .state('myData', {
    cache: false,
    url: '/myData',
    templateUrl: 'templates/myData.html',
    controller: 'myDataCtrl'
  })

  .state('errorRoute', {
    cache: false,
    url: '/errorRoute',
    templateUrl: 'templates/errorRoute.html',
    controller: 'errorRouteCtrl'
  })

  .state('myRouteDetail', {
    cache: false,
    url: '/myRouteDetail',
    templateUrl: 'templates/myRouteDetail.html',
    controller: 'myRouteDetailCtrl'
  })

$urlRouterProvider.otherwise('/main')
});