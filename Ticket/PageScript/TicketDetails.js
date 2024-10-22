var app = angular.module("MyApp", []);
app.controller("TicketDetailsController", function ($scope, $http, $window, $location, $interval, $compile, $filter, $element, $anchorScroll) {

    GetTicketDetails();
    GetCallCenterMessages();
    BindingEmployeeList();
    $scope.isFullScreenImage = false;
    $scope.selectedFile = null;
    $scope.imageUrl = '';
    var intervalPromise = $interval(function () {
        GetCallCenterMessages();
    }, 300 * 60);
    function BindingEmployeeList() {
        $http.post("../TicketSystem/GetCallCenterMember", {}
        )
            .then(function (response) {
                if (response.status === 200) {
                    $scope.CallCenterEmployeeList = response.data;
                }
            }, function (error) {
                console.log(error);
            });
    }
   
    function GetCallCenterMessages() {
        var TID = "";
        var urlString = window.location.href;

        let paramString = urlString.split('?')[1];
        let queryString = new URLSearchParams(paramString);
        for (let pair of queryString.entries()) {
            if (pair[0] == 'Id') {
                TID = pair[1];
            }
        }
        TID = TID.replaceAll(' ', '+');
        $http.post("../TicketSystem/GetCallCenterMessages", { TicketID: TID }
        )
            .then(function (response) {
                if (response.status === 200) {
                    $scope.CallCenterMessagesList = response.data;
                }
            }, function (error) {
                console.log(error);
            });
    }
    function GetTicketDetails() {
    
        var TID = "";
        var flag = "";
        var urlString = window.location.href;

        let paramString = urlString.split('?')[1];
        let queryString = new URLSearchParams(paramString);
        for (let pair of queryString.entries()) {
            if (pair[0] == 'Id') {
                TID = pair[1];
            }
        }
        TID = TID.replaceAll(' ', '+');
        for (let pair of queryString.entries()) {
            if (pair[0] == 'Flag') {
                flag = pair[1];
            }
        }
        flag = flag.replaceAll(' ', '+');
        if (flag == "") {
            $scope.IscmbTicketStatusVisible = false;
            $scope.IscmbAssignToVisible = false;
            $scope.IsBtnSaveShow = false;
        }
        else {
           
            $scope.IscmbAssignToVisible = true;
            $scope.IscmbTicketStatusVisible = true;
            $scope.IsBtnSaveShow = true;
        }
        $http.post("../TicketSystem/GetTicketDetails", { TicketID: TID }
        )
            .then(function (response) {
                if (response.status === 200) {
                    $scope.TicketDetails = response.data;
                    $scope.AssignedTo = $scope.TicketDetails.AssignTo;
                    $scope.TicketStatus = $scope.TicketDetails.StatusCode;

                    if ($scope.TicketStatus == 3) {
                        $scope.IsbtnSendMsgVisible = false;
                    }
                    else {
                        $scope.IsbtnSendMsgVisible = true;
                    }

                    if ($scope.TicketDetails.LogInUserID == 2) {
                        $scope.IscmbAssignToVisible = true;
                        $scope.optionsToShow = [
                            { label: 'Open', value: '1' },
                            { label: 'Under Process', value: '2' },
                            { label: 'Closed', value: '3' }
                        ];
                    }
                    else {
                        $scope.IscmbAssignToVisible = false;
                        $scope.optionsToShow = [
                            { label: 'Closed', value: '3' }
                        ];
                    }
                    
                }
            }, function (error) {
                console.log(error);
                
            });
    }
    $scope.SendMessageskeyup = function (eve) {
        $scope.usernewchat = eve.target.value
    }
    $scope.SendMessages = function () {
        $scope.MsgData = {};
        var TickID = "";
        var TicketID = 0;
        var urlString = window.location.href;

        let paramString = urlString.split('?')[1];
        let queryString = new URLSearchParams(paramString);
        for (let pair of queryString.entries()) {
            if (pair[0] == 'Id') {
                TickID = pair[1];
            }
        }
        TicketID = TickID.replaceAll(' ', '+');
        $scope.MsgData.TicketID = TicketID;
        $scope.MsgData.Message = $scope.usernewchat;

        $http.post("../TicketSystem/SendMessages", { MSG: $scope.MsgData }
        )
            .then(function (response) {
                if (response.status === 200) {
                    $scope.usernewchat = "";
                    GetCallCenterMessages();
                    setTimeout(function () {
                        var chatDiv = document.getElementById('scroll');
                        var height = chatDiv.scrollHeight;
                        chatDiv.scrollTop = height;
                    }, 100);
                }
            }, function (error) {
                console.log(error);
            });

    };
    $scope.AssignTicket = function () {
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

        $http.post("../TicketSystem/AssignTicket", { TicketID: TicketID, AssignTo: $scope.AssignedTo, StatusID: $scope.TicketStatus, AdminRemark: $scope.TicketRemarks })
            .then(function (response) {
                if (response.status === 200) {
                    alert(response.data.ResponseMsg);
                    
                }
            }, function (error) {
                console.log(error);
                
            });
    };
    $scope.openFullScreenImage = function (FullScreenImg) {
        const fileExtension = FullScreenImg.split('.').pop().toLowerCase();


        if (fileExtension === 'pdf') {
            window.open(FullScreenImg, '_blank');
        } else {
            $scope.isFullScreenImage = true;
            $scope.FullScreenImgPath = FullScreenImg;
        }



    };
    $scope.closeFullScreenImage = function () {
        $scope.isFullScreenImage = false;
        $scope.FullScreenImgPath = '';
    };
    $scope.pnlUploadImgVisible = function () {
        $('#ModelSendImg').modal('show');
    };
    $scope.pnlUploadImgHide = function () {
        $scope.pnlUploadImgShow = false;
    };
    $scope.updateImage = function () {
        var fileInput = document.getElementById('TicketImageUpload');

        if (fileInput.files && fileInput.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $scope.$apply(function () {
                    $scope.imageUrl = e.target.result;
                });
            };
            reader.readAsDataURL(fileInput.files[0]);
        } else {
            // Reset the image source if no file is selected
            $scope.imageUrl = ' ';
        }
        //alert($scope.imageUrl.toString().length);
        //if ($scope.imageUrl.toString().length > 1) {
        //    IsbtnSendImgVisible = true;
        //}
        //else { 
        //    IsbtnSendImgVisible = false;
        //}
    };
    $scope.SendMessagesImg = function () {
       
        var TickID = "";
        var TicketID = 0;
        var urlString = window.location.href;

        let paramString = urlString.split('?')[1];
        let queryString = new URLSearchParams(paramString);
        for (let pair of queryString.entries()) {
            if (pair[0] == 'Id') {
                TickID = pair[1];
            }
        }
        TicketID = TickID.replaceAll(' ', '+');


        var fileInput = document.getElementById('TicketImageUpload');
        var filePath = fileInput.value;
        var allowedExtensions = /(\.pdf|\.jpg|\.jpeg|\.png)$/i;
        if (!allowedExtensions.test(filePath)) {
            alert('Please upload files having extensions .pdf, .jpg, .jpeg, or .png only.');

            return false;
        }
       

        var files = $("#TicketImageUpload").get(0).files;
        if (files.length > 0) {
            //alert("hi");
            //debugger;
            var data = new FormData();
            data.append("MyDoc", files[0]);
            data.append("TicketID", TicketID);
            $.ajax({
                type: "POST",
                url: "../TicketSystem/AttachemntUploadForTicket",
                processData: false,
                contentType: false,
                data: data,
          
                success: function (data) {
                   
                    $scope.usernewchat = "";
                    $("#TicketImageUpload").val("");
                    $scope.selectedFile = null;
                    $scope.imageUrl = '';
                    $('#ModelSendImg').modal('hide');
                    GetCallCenterMessages();
                    setTimeout(function () {
                        var chatDiv = document.getElementById('scroll');
                        var height = chatDiv.scrollHeight;
                        chatDiv.scrollTop = height;
                    }, 100);
                },
                error: function (result) {

                }
                

            });
            $('#ModelSendImg').on('hidden.bs.modal', function () {
                window.location.reload();
            });
        }
          
    };
    $scope.AddTicket = function () {
        $('#ModelSendImg').modal('show');
    };
    $scope.ShowFullSCrrenImg = function (FullScreenImgPath) {
        $scope.FullScreenImgPath = FullScreenImgPath;
        $scope.isShowFullScreenImage = true;
        $('#FullScrrenImg').modal('show');
    };
    $scope.closeFullScreenImage = function () {
        $('#FullScrrenImg').modal('hide');
    }
    $scope.hideModelSendImg = function () {
        $('#ModelSendImg').modal('hide');
        $('#ModelSendImg').on('hidden.bs.modal', function () {
            window.location.reload();
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

});