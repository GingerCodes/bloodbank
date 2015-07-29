var app = angular.module("bloodbankapp", ['ui.router', 'ngResource', 'lbServices', 'ngAutocomplete', 'ngMaterial']);

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

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
                        'user': function ($rootScope, User) {
                            return  User.getCurrent({filter: {where: {'is_confirm': false}, include: ['requests', 'donations']}});
                        },
                    },
                })
                .state('myRequest', {
                    url: "/profile/request/:id",
                    controller: ['$scope', 'request', function ($scope, request) {
                            $scope.request = request;
                        }],
                    templateUrl: "../../views/profile.request.html",
                    resolve: {
                        request: function (User, $stateParams, $rootScope) {
                            return User.requests.findById({id: $rootScope.currentUser.id}, {fk: $stateParams.id});
                        }
                    }
                })
                .state('requests', {
                    url: "/requests",
                    controller: ['$scope', 'requests', function ($scope, requests) {
                        $scope.requests = requests;
                        }],
                    templateUrl: "views/requests.html",
                    resolve: {
                        requests: function (Request, $stateParams, $rootScope) {
                            return Request.findRecentRequests();
                        }
                    }
                })
                .state('request', {
                    url: "/request/:id",
                    templateUrl: "views/request.html",
                    controller: "RequestController",
                    resolve: {
                        request: function (Request, $stateParams) {
                            return Request.findById({id: $stateParams.id, filter: {"include": "user"}});
                        },
                        user: function (User, $rootScope) {
                            if ($rootScope.currentUser)
                                return User.getCurrent();
                            else
                                return null;
                        },
                        is_donated: function (User, $stateParams, $rootScope) {
                            if ($rootScope.currentUser) {
                                return User.donations.exists({
                                    id: $rootScope.currentUser.id,
                                    fk: $stateParams.id
                                }).$promise.then(function () {
                                    return true;
                                }, function () {
                                    return false;
                                });
                            }
                            else
                                return false;
                        },
                        count: function (Donation, $stateParams) {
                            return {
                                "confirmed": Donation.count({where: {"requestId": $stateParams.id, "is_confirm": true}}),
                                "pending": Donation.count({where: {"requestId": $stateParams.id, "is_confirm": false}})
                            }
                        }
                    }

                });
        $locationProvider.html5Mode(true);
        // Inside app config block
        $httpProvider.interceptors.push(['$rootScope', '$q', '$location', 'LoopBackAuth',
            function ($rootScope, $q, $location, LoopBackAuth) {
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
            }]);
    }]);

app.run(["$rootScope", 'LoopBackAuth', function ($rootScope, LoopBackAuth) {
        $rootScope.$on("$stateChangeStart", function () {
            if (!$rootScope.currentUser && LoopBackAuth.currentUserId) {
                $rootScope.currentUser = LoopBackAuth;
            }
        });
    }]);