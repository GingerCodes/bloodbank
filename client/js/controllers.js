app.controller("homepagectrl", function ($scope, Profile, Request) {
    $scope.users = Profile.find({filter: {where: {first_name: 'Alex'}}});
    $scope.requests = Request.find();
    //$scope.users = Profile.count();
    console.log($scope.users);
    console.log($scope.requests);


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