app.controller("HomeController", function ($scope, Profile, Request, User) {
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



    $scope.search = function () {
        var upper_lat = $scope.search_form.location_details.geometry.location.A + 0.03;
        var lower_lat = $scope.search_form.location_details.geometry.location.A - 0.03;
        var upper_lng = $scope.search_form.location_details.geometry.location.F + 0.03;
        var lower_lng = $scope.search_form.location_details.geometry.location.F - 0.03;

        $scope.match_donors = User.count({where: {"blood_group": $scope.search_form.blood_group,
                "location_details.geometry.location.A": {between: [lower_lat, upper_lat]},
                "location_details.geometry.location.F": {between: [lower_lng, upper_lng]}
            }});
    }
});

app.controller("UserController", function ($rootScope, $scope, $location, User, flashr) {
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
//            user.date_of_birth = "2-2-1988";
//            user.gender = true;
            user.$create({}, function (data) {
                flashr.later.success("Registration Completed Succesfully.");
                $location.path('/');
            }, function (err) {
                var messages = err.data.error.details.messages;
                for (var key in messages) {
                    if (messages.hasOwnProperty(key)) {
                        flashr.now.warning(key + " " + messages[key]);
                    }
                }
            });
        } else {
            flashr.now.error("Please fill all the fields.");
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
                flashr.later.success("Succesfully Logged In");
                $location.path('/');
            })
        } else {
            flashr.now.error("Invalid");
        }
    };
});

app.controller('AuthLogoutController', ['$rootScope', '$scope', '$location', 'User',
    function ($rootScope, $scope, $location, User) {
        User.logout().$promise.then(function () {
            $rootScope.currentUser = null;
            $location.path('/');
        });
    }])