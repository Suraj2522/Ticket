var app = angular.module("MyApp", []);
app.controller("SupportAdminPortalController", function ($scope, $http) {
   
    GetUserID();
    
    function GetUserID() {
        
        $http.post("../TicketSystem/GetUserID", {})
            .then(function (response) {
                if (response.status === 200) {
                    if (response.data == '1')  {
                        $('#OpenticketsShow').show();
                    }
                    else {
                        $('#OpenticketsShow').hide();
                    }
                }
            }, function (error) {
                console.log(error);
            });
      
        $http.post("../TicketSystem/GetStatusCount", {})
            .then(function (response) {
                if (response.status === 200) {
                    $scope.OpenCount = response.data.OpenCount;
                    $scope.UnderProcessCount = response.data.UnderProcessCount;
                    $scope.CloseCount = response.data.CloseCount;
                }
            }, function (error) {
                console.log(error);
            });
    };
    $scope.logout = function () {

        $http.post("../TicketSystem/Logout")
            .then(function (response) {
                if (response.status === 200) {
                    // Redirect to login page after successful logout
                    window.location.href = response.data.redirectUrl; // Use the redirectUrl from the response
                }
            }, function (error) {
                console.log(error);
            });
    };
});