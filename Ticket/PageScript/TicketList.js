var app = angular.module("MyApp", []);
app.controller("TicketSystemController", function ($scope, $http, $window, $location, $interval, $compile, $filter, $element, $anchorScroll) {
    debugger;
    /************Pagination Variable*****************/
    var PageSize = 0;
    //var CurrentIndex = 1;
    //$scope.PageSelected = 5;
    //PageSize = $scope.PageSelected;
    //$scope.PageSelectedTest = 5;
    //PageSizeTest = $scope.PageSelectedTest;
    //$scope.PaginationSizeListTest = PaginationSize();
   /* $scope.PaginationSizeList = PaginationSize();*/
   /* var TicketListPagination = "";*/
    $scope.Ratings = 0;
    /************End**********************************/
    /*************************Pagination****************************/
    //$scope.PageSelectedChange = function () {
    //    PageSize = $scope.PageSelected;
    //    BindingTicketList(CurrentIndex, PageSize);
    //}
    //$scope.NextPagination = function (PaginationSize, TotalRecords, CurrentIndex) {
    //    BindingTicketList((PaginationSize * (CurrentIndex - 1)) + 1, (PaginationSize * CurrentIndex))
    //    TicketListPagination = GeneratePagination(PaginationSize, $scope.TotalRecord, CurrentIndex + 1, "active", "PreviousPagination", "CurrentPagination", "NextPagination");
    //    BindPagination();
    //}
    //$scope.PreviousPagination = function (PaginationSize, TotalRecords, CurrentIndex) {
    //    BindingTicketList((PaginationSize * (CurrentIndex - 1)) + 1, (PaginationSize * CurrentIndex))
    //    TicketListPagination = GeneratePagination(PaginationSize, $scope.TotalRecord, CurrentIndex - 1, "active", "PreviousPagination", "CurrentPagination", "NextPagination");
    //    BindPagination();
    //}
    //$scope.CurrentPagination = function (PaginationSize, TotalRecords, CurrentIndex) {
    //    BindingTicketList((PaginationSize * (CurrentIndex - 1)) + 1, (PaginationSize * CurrentIndex))
    //    TicketListPagination = GeneratePagination(PaginationSize, $scope.TotalRecord, CurrentIndex, "active", "PreviousPagination", "CurrentPagination", "NextPagination");
    //    BindPagination();
    //}
    //function BindPagination() {
    //    $("#PaginationPage").empty();
    //    TicketListPagination = $compile(TicketListPagination)($scope);
    //    $("#PaginationPage").append(TicketListPagination);
    //}
    /*************************Pagination****************************/
   
    BindingTicketList(1, 5, '');
   /* GetUserID();*/

    function BindingTicketList(CurrentIndex, ToIndex, FilteredData) {
        var flag = "";
        var urlString = window.location.href;

        let paramString = urlString.split('?')[1];
        let queryString = new URLSearchParams(paramString);
        for (let pair of queryString.entries()) {
            if (pair[0] == 'Flag') {
                flag = pair[1];
            }
        }
        flag = flag.replaceAll(' ', '+');
        if (flag == "") {
            $scope.IsbtnRaiseTicketVisible = true;
            flag = 0;
        }
        else {
            $scope.IsbtnRaiseTicketVisible = false;
        }
        $http.post("../TicketSystem/GetTickets", { StatusID: flag }
        )
            .then(function (response) {
                if (response.status === 200) {
                    $scope.TicketList = response.data;
                                      
                }
            }, function (error) {
                console.log(error);
               /* */
            });
        /**/
    }
   
    $scope.AddTicket = function () {
        $('#myModalRaiseTicket').modal('show');
    };
    $scope.SaveTicket = function () {

        debugger;
        $scope.Data = {};
        //if ($scope.DependentID == undefined || $scope.DependentID == '') {
        //    alert('Please Select Dependent.');
        //    return;
        //}
        if ($scope.TicketSystem.QueryType == undefined) {
            alert('Please Select Query Type');
            return;
        }
        if ($scope.TicketSystem.Description == undefined || $scope.TicketSystem.Description == '') {
            alert('Please Mention Issue.');
            return;
        }
        if ($scope.TicketSystem.QueryType == "Query") {
            if ($scope.TicketSystem.IsRaiseQueryFor == undefined) {
                alert('Please Select Raise Query For');
                return;
            }
            else {
                $scope.Data.Subject = $scope.TicketSystem.IsRaiseQueryFor;
            }
        }
        else if ($scope.TicketSystem.QueryType == "Escalation") {
            if ($scope.TicketSystem.EscalateFor == undefined) {
                alert('Please Select Escalate For');
                return;
            }
            else {
                $scope.Data.Subject = $scope.TicketSystem.EscalateFor;
            }
        }
        
        $scope.Data.QueryType = $scope.TicketSystem.QueryType;
        $scope.Data.Description = $scope.TicketSystem.Description;
       // $scope.Data.DependentID = $scope.DependentID;
        // alert('before controller 1');
        console.log("Data to send:", $scope.Data);

        $http.post("../TicketSystem/CreateUserTicket?s",  $scope.Data )
       
            .then(function (response) {
                if (response.status === 200) {
                    alert('Ticket Generated Successfully.');
                    $('#myModalRaiseTicket').modal('hide'); 
                    BindingTicketList(1, 1,'');
                    
                }
            }, function (error) {
                alert('after  error ');
                console.log(error);
                
            });
       
    };
    $scope.ViewTicketDetails = function (x) {
        var flag = "";
        var urlString = window.location.href;

        let paramString = urlString.split('?')[1];
        let queryString = new URLSearchParams(paramString);
        for (let pair of queryString.entries()) {
            if (pair[0] == 'Flag') {
                flag = pair[1];
            }
        }
        flag = flag.replaceAll(' ', '+');
        //var encryptedId = CryptoJS.AES.encrypt(x.toString(), encryptionKey).toString();
        window.location.href = '../TicketSystem/TicketDetails?Id=' + x + '&Flag=' + flag + '';
    };
   
    function GetUserID() {
        $http.post("../TicketSystem/GetDependent", {})
            .then(function (response) {
                if (response.status === 200) {
                    $scope.DependentList = response.data;
                }
            }, function (error) {
                console.log(error);
            });
    };
    $scope.ngOnRatingClicked = function (x) {
        $scope.Ratings = x;

        poor_1.checked = false;
        poor_2.checked = false;
        poor_3.checked = false;
        poor_4.checked = false;

        BelowAverage_1.checked = false;
        BelowAverage_2.checked = false;
        BelowAverage_3.checked = false;
        BelowAverage_4.checked = false;

        Average_1.checked = false;
        Average_2.checked = false;
        Average_3.checked = false;
        Average_4.checked = false;

        Good_1.checked = false;
        Good_2.checked = false;
        Good_3.checked = false;
        Good_4.checked = false;

        Excellent_1.checked = false;
        Excellent_2.checked = false;
        Excellent_3.checked = false;
        Excellent_4.checked = false;
        if (x == 5) {
            $(".Excellent").show();
            $(".Good").hide();
            $(".Average").hide();
            $(".BelowAverage").hide();
            $(".poor").hide();
        }
        else if (x == 4) {
            $(".Excellent").hide();
            $(".Good").show();
            $(".Average").hide();
            $(".BelowAverage").hide();
            $(".poor").hide();
        }
        else if (x == 3) {
            $(".Excellent").hide();
            $(".Good").hide();
            $(".Average").show();
            $(".BelowAverage").hide();
            $(".poor").hide();
        }
        else if (x == 2) {
            $(".Excellent").hide();
            $(".Good").hide();
            $(".Average").hide();
            $(".BelowAverage").show();
            $(".poor").hide();
        }
        else if (x == 1) {
            $(".Excellent").hide();
            $(".Good").hide();
            $(".Average").hide();
            $(".BelowAverage").hide();
            $(".poor").show();
        }
    }
    $scope.SaveTicketFeedback = function () {

        var FeedBackPoints = "";
        if (poor_1.checked) {
            FeedBackPoints = FeedBackPoints + "High resolution time|";
        }
        if (poor_2.checked) {
            FeedBackPoints = FeedBackPoints + "Irrelevant information|";
        }
        if (poor_3.checked) {
            FeedBackPoints = FeedBackPoints + "Unsatisfactory response|";
        }
        if (poor_4.checked) {
            FeedBackPoints = FeedBackPoints + "Difficult to use|";
        }

        if (BelowAverage_1.checked) {
            FeedBackPoints = FeedBackPoints + "High resolution time|";
        }
        if (BelowAverage_2.checked) {
            FeedBackPoints = FeedBackPoints + "Irrelevant information|";
        }
        if (BelowAverage_3.checked) {
            FeedBackPoints = FeedBackPoints + "Unsatisfactory response|";
        }
        if (BelowAverage_4.checked) {
            FeedBackPoints = FeedBackPoints + "Difficult to use|";
        }

        if (Average_1.checked) {
            FeedBackPoints = FeedBackPoints + "High resolution time|";
        }
        if (Average_2.checked) {
            FeedBackPoints = FeedBackPoints + "Irrelevant information|";
        }
        if (Average_3.checked) {
            FeedBackPoints = FeedBackPoints + "Unsatisfactory response|";
        }
        if (Average_4.checked) {
            FeedBackPoints = FeedBackPoints + "Difficult to use|";
        }

        if (Good_1.checked) {
            FeedBackPoints = FeedBackPoints + "Quick resolution time|";
        }
        if (Good_2.checked) {
            FeedBackPoints = FeedBackPoints + "Relevant information|";
        }
        if (Good_3.checked) {
            FeedBackPoints = FeedBackPoints + "Satisfactory response|";
        }
        if (Good_4.checked) {
            FeedBackPoints = FeedBackPoints + "Ease to use|";
        }

        if (Excellent_1.checked) {
            FeedBackPoints = FeedBackPoints + "Quick resolution time|";
        }
        if (Excellent_2.checked) {
            FeedBackPoints = FeedBackPoints + "Relevant information|";
        }
        if (Excellent_3.checked) {
            FeedBackPoints = FeedBackPoints + "Satisfactory response|";
        }
        if (Excellent_4.checked) {
            FeedBackPoints = FeedBackPoints + "Ease to use|";
        }
        if ($scope.Ratings == 0 || $scope.Ratings == undefined || $scope.Ratings == '') {
            alert('Please give a Rating.');
            return;
        }

        if (FeedBackPoints.length > 1) {
            FeedBackPoints = FeedBackPoints.slice(0, -1);
        }
        //else {
        //    alert('Please select Feedback points');
        //    return;
        //}
        if ($scope.Concern == '' || $scope.Concern == undefined) {
            alert('Please enter a Feedback.');
            return;
        }

        var TicketID = "";
        var urlString = window.location.href;
        let paramString = urlString.split('?')[1];
        let queryString = new URLSearchParams(paramString);
        for (let pair of queryString.entries()) {
            if (pair[0] == 'Id') {
                TicketID = pair[1];
            }
        }
        TicketID = TicketID.replaceAll(' ', '+');

      
        $http.post("../TicketSystem/SaveFeedback", { TicketID: TicketID, Concern: $scope.Concern, ImprovementInFuture: $scope.ImprovementInFuture, FeedBackPoints: FeedBackPoints, Ratings: $scope.Ratings })
            .then(function (response) {
                if (response.status === 200) {
                    alert('Feedback saved.');
                }
                
            }, function (error) {
                
                console.log(error);
            });

    }
    $scope.logout = function () {
     
        debugger;

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
    //$scope.Test = function () {
    //    alert('Hiiii');
    //}
});