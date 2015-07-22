var app = angular.module("bloodbankapp", ['ngRoute', 'ngResource', 'lbServices', 'ngAutocomplete', 'ngMaterial', 'flashr']);

app
        .config(function ($routeProvider, $locationProvider, $httpProvider) {
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
                    .when('/logout', {
                        controller: 'AuthLogoutController',
                        template: " "
                    })
                    .when('/profile', {
                        controller: 'ProfileController',
                        templateUrl: "views/profile.html"
                    })
                    .otherwise({
                        redirectTo: '/'
                    });

            $locationProvider.html5Mode(true);

            // Inside app config block
            $httpProvider.interceptors.push(function ($q, $location, LoopBackAuth) {
                  return {
                        responseError: function (rejection) {
                              if (rejection.status == 401) {
                                    //Now clearing the loopback values from client browser for safe logout...
                                    LoopBackAuth.clearUser();
                                    LoopBackAuth.clearStorage();
                                    $location.nextAfterLogin = $location.path();
                                    $location.path('/login');
                              }
                              return $q.reject(rejection);
                        }
                  };
            });
        });

app.run(["$rootScope", "$location", function ($rootScope, $location) {

//        LoopBackAuth.setUser(window.localStorage.$LoopBack$accessTokenId, window.localStorage.$LoopBack$currentUserId);
        $rootScope.$on("$routeChangeSuccess", function () {

            if (!$rootScope.currentUser && localStorage.$LoopBack$currentUserId) {
                $rootScope.currentUser = {
                    id: localStorage.$LoopBack$currentUserId,
                    tokenId: localStorage.$LoopBack$accessTokenId,
                };
            }
        });
    }]);