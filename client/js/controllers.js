app.controller("HomeController", function ($scope, $q, Profile, Request, User) {
    $scope.users = User.count();

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

    $scope.signup = function () {
        if ($scope.user.$valid) {
            var user = new User();
            user.email = $scope.user.email;
            user.password = $scope.user.password;
            user.first_name = $scope.user.first_name;
            user.last_name = $scope.user.last_name;
            user.blood_group = $scope.user.blood_group;
            user.location = $scope.user.location;
            user.location_details = $scope.user.location_details;
            user.date_of_birth = "2-2-1988";
            user.gender = true;
            user.$create();
        } else {
            console.log("Not Valid");
        }
    }


    $scope.submit = function () {
        console.log('Submitted');
        var request = new Request();
        console.log(request);
        request.blood_group = $scope.blood_group;
        request.location = $scope.location;
        request.$save();
        $scope.requests = Request.find();
    }
});