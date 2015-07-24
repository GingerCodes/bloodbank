var app = angular.module("bloodbankapp", ['ui.router', 'ngResource', 'lbServices', 'ngAutocomplete', 'ngMaterial']);

app
        .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

            $urlRouterProvider.otherwise("/");
            $stateProvider
                    .state('home', {
                        url: "/",
                        controller: 'HomeController',
                        templateUrl: 'views/home.html'
                    })
                    .state('register', {
                        url: "/register",
                        controller: 'UserController',
                        templateUrl: 'views/register.html'
                    })
                    .state('login', {
                        url: "/login",
                        controller: 'UserController',
                        templateUrl: 'views/login.html'
                    })
                    .state('logout', {
                        url: "/logout",
                        controller: 'AuthLogoutController',
                        template: " "
                    })
                    .state('profile', {
                        url: "/profile",
                        controller: 'ProfileController',
                        templateUrl: "views/profile.html",
                        resolve: {
                            'requests': function ($rootScope, User) {
                                return User.requests({id: $rootScope.currentUser.id});
                            }
                        }
                    })
                    .state('myRequest', {
                        url: "/profile/request/:id",
                        controller: function ($scope, request) {
                            $scope.requests = request;
                        },
                        templateUrl: "../../views/profile.request.html",
                        resolve: {
                            request: function (User, $stateParams, $rootScope) {
                                return User.requests.findById({id: $rootScope.currentUser.id}, {fk: $stateParams.id});
                            }
                        }
                    })
                    .state('requests', {
                        url: "/requests",
                        controller: function ($scope, requests) {
                            $scope.requests = requests;
                        },
                        templateUrl: "views/requests.html",
                        resolve: {
                            requests: function (Request, $stateParams, $rootScope) {
                                return Request.find();
                            }
                        }
                    })
                    .state('request', {
                        url: "/request/:id",
                        templateUrl: "views/request.html",
                        controller: function ($scope, request) {
                            $scope.request = request;
                        },
                        resolve: {
                            request: function (Request, $stateParams, $rootScope) {
                                return Request.findById({id: $stateParams.id});
                            },
                        }
                    })
                    ;

            $locationProvider.html5Mode(true);

            // Inside app config block
            $httpProvider.interceptors.push(function ($rootScope, $q, $location, LoopBackAuth) {
                  return {
                        responseError: function (rejection) {
                              if (rejection.status == 401) {
                            if ($rootScope.currentUser) {
                                Materialize.toast("Unauthorized Access", 4000);
                                $location.path('/');
                            } else {
                                        //Now clearing the loopback values from client browser for safe logout...
                                        LoopBackAuth.clearUser();
                                        LoopBackAuth.clearStorage();
                                $rootScope.currentUser = null;
                                        $location.nextAfterLogin = $location.path();
                                Materialize.toast("Login to continue", 4000);
                                        $location.path('/login');
                                  }
                        }
                              return $q.reject(rejection);
                        }
                  };
            });
        });
app.run(["$rootScope", "$location", function ($rootScope, $location) {

//        LoopBackAuth.setUser(window.localStorage.$LoopBack$accessTokenId, window.localStorage.$LoopBack$currentUserId);
        $rootScope.$on("$stateChangeSuccess", function () {
            if (!$rootScope.currentUser && localStorage.$LoopBack$currentUserId) {
                $rootScope.currentUser = {
                    id: localStorage.$LoopBack$currentUserId,
                    tokenId: localStorage.$LoopBack$accessTokenId,
                };
            }
        });
    }]);