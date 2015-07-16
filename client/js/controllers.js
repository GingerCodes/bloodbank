app.controller("homepagectrl",function($scope,User){
    $scope.users = User.query();
});