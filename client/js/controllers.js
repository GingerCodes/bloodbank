app.controller("HomeController", ['$rootScope', '$scope', 'User',
    function ($rootScope, $scope, User) {
        $scope.users = User.count();
        $scope.match_donors = {
            count: 0
        };
        $scope.blood_groups = [
            'A+',
            'A-',
            'B+',
            'B-',
            'AB+',
            'AB-',
            'O+',
            'O-',
            'Any',
        ];
        $scope.location_options = {
            types: '(cities)',
            watchEnter: true
        };

        $scope.search_doner = function () {
            if ($scope.search_form.$valid && typeof $scope.search.location_details != 'undefined') {
                $scope.match_donors = User.countDonors({blood_group: $scope.search.blood_group, location: $scope.search.location_details.geometry.location});
                $scope.search_form.$setPristine();
            } else {
                Materialize.toast("Please fill all the fields.", 4000)
            }
        }

        $scope.request = function () {
            if ($scope.search_form.$valid && $scope.search_form.$pristine) {
                console.log($scope.search.blood_group);
                User.requests.create({id: $rootScope.currentUser.id}, $scope.search).$promise.then(function (data) {
                    Materialize.toast("Request Recived.", 4000);
                })
            }
        }
    }]);

app.controller("UserController", ['$rootScope', '$scope', '$location', 'User',
    function ($rootScope, $scope, $location, User) {
        $scope.blood_groups = [
            'A+',
            'A-',
            'B+',
            'B-',
            'AB+',
            'AB-',
            'O+',
            'O-',
            'Any',
        ];

        $scope.location_options = {
            types: '(cities)',
            watchEnter: true
        };

        $scope.register = function () {
            if ($scope.user.$valid) {
                var user = new User();
                user.email = $scope.user.email;
                user.password = $scope.user.password;
                user.first_name = $scope.user.first_name;
                user.last_name = $scope.user.last_name;
                user.blood_group = $scope.user.blood_group;
                user.location = $scope.user.location;
                user.location_details = $scope.user.location_details;
                user.date_of_birth = $scope.user.date_of_birth;
                user.gender = true;
                user.$create({}, function (data) {
                    Materialize.toast("Registration Completed Succesfully.", 4000);
                    $location.path('/');
                }, function (err) {
                    var messages = err.data.error.details.messages;
                    for (var key in messages) {
                        if (messages.hasOwnProperty(key)) {
                            Materialize.toast(key + " " + messages[key], 4000);
                        }
                    }
                });
            } else {
                Materialize.toast("Please fill all the fields.", 4000);
            }
        };

        $scope.login = function () {
            if ($scope.loginForm.$valid) {
                User.login($scope.user).$promise.then(function (response) {
                    $rootScope.currentUser = {
                        id: response.user.id,
                        tokenId: response.id,
                        email: $scope.user.email
                    };

                    Materialize.toast("Succesfully Logged In", 4000);
                    $location.path('/');
                })
            } else {
                Materialize.toast("Invalid", 4000);
            }
        };
    }]);

app.controller('AuthLogoutController', ['$rootScope', '$scope', '$location', 'User',
    function ($rootScope, $scope, $location, User) {
        User.logout().$promise.then(function () {
            $rootScope.currentUser = null;
            $location.path('/');
        });
    }]);