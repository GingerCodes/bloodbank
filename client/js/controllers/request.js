app.controller('RequestController', ['$scope', 'user', "request", 'is_donated', 'willing_donors_count', 'Request', 'User',
    function ($scope, request, user, is_donated, willing_donors_count, Request, User) {
        $scope.request = request;
        $scope.user = user;
        $scope.is_donated = is_donated;
        $scope.willing_donors_count = willing_donors_count;

        $scope.donate = function () {
            User.donations.link({
                id: request.id,
                fk: user.id
            }, {
                is_confirm: true
            });
        }
    }]);