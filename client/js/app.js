var app = angular.module("bloodbankapp", ['ngRoute', 'ngResource', 'lbServices', 'ngAutocomplete', 'ngMaterial', 'flashr']);

app
        .config(function ($routeProvider, $locationProvider) {
            $routeProvider
                    .when('/', {
                        controller: 'HomeController',
                        templateUrl: 'views/home.html'
                    })
                    .when('/register', {
                        controller: 'UserController',
                        templateUrl: 'views/register.html'
                    })
                    .when('/login', {
                        controller: 'UserController',
                        templateUrl: 'views/login.html'
                    })
                    .otherwise({
                        redirectTo: '/'
                    });

            $locationProvider.html5Mode(true);
        });