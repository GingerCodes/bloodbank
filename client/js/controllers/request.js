app.controller('RequestController', ['$scope', 'request', 'user', 'is_donated', 'count', 'Request', 'User',
    function ($scope, request, user, is_donated, count, Request, User) {
        $scope.request = request;
        $scope.user = user;
        $scope.is_donated = is_donated;
        $scope.count = count;
        


        $scope.donate = function () {
            User.donations.link({
                fk: request.id,
                id: user.id
            }, {
                is_confirm: true
            });
        }
    }
]);