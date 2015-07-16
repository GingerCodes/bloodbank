app.controller("homepagectrl",function($scope,Profile){
    $scope.users = Profile.find({filter:{where:{first_name:'Alex'}}});
    //$scope.users = Profile.count();
    console.log($scope.users);
});