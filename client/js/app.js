var app = angular.module("bloodbankapp", ['ngRoute', 'ngResource', 'ui.bootstrap', 'lbServices', 'ngAutocomplete']);

app
        .config(function ($routeProvider, $locationProvider) {
            $routeProvider
                    .when('/', {
                        controller: 'HomeController',
                        templateUrl: 'views/home.html'
                    })
                    .otherwise({
                         redirectTo: '/'
                    });

            $locationProvider.html5Mode(true);
        });