var app = angular.module('patient', ['angularModalService', 'ngAnimate','LocalStorageModule','720kb.datepicker']);
app.controller('patient_controller', ['$scope','$window','$http','$location', 'ModalService','localStorageService',
    function($scope, $window, $http, $location, ModalService, localStorageService) {

        var email = localStorageService.get("emailID");
        var type = localStorageService.get("type");

        $scope.init = function(){
            if(email != null && type=="Patient"){
                var dataObj = {
                    email: email,
                };
                $http.post("/patientdetails/getDetails", JSON.stringify(dataObj), {
                    headers:{
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers": "*",
                        "Access-Control-Allow-Methods": "*"
                    }
                }).then(function(response){
                    if(response.data){
                        console.log(response.data);
                        $scope.first_name = response.data.first_name;
                        $scope.last_name = response.data.last_name;
                        $scope.designation = response.data.designation;
                        $scope.phone = response.data.phone;
                        $scope.email = response.data.email;
                        $scope.dateofbirth = response.data.dateofbirth;
                        $scope.address = response.data.address;
                        $scope.gender = response.data.gender;
                    }
                }, function(response){
                    console.log("failure");
                });

                $http.post("/schedules/pastAppointment", JSON.stringify(dataObj), {
                    headers:{
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers": "*",
                        "Access-Control-Allow-Methods": "*"
                    }
                }).then(function(response){
                    if(response.data){
                        console.log("Chal gaya -> Past");
                        console.log(response.data.length)
                        $scope.pastAppointment = []
                        for (var i=0;i<response.data.length;i+=3){
                            $scope.pastAppointment.push(response.data.slice(i,i+3));
                        }
                        console.log($scope.pastAppointment)
                    }
                }, function(response){
                    console.log("failure");
                });

                $http.post("/schedules/futureAppointment", JSON.stringify(dataObj), {
                    headers:{
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers": "*",
                        "Access-Control-Allow-Methods": "*"
                    }
                }).then(function(response){
                    if(response.data){
                        console.log("Chal gaya -> Future");
                        console.log(response.data.length)
                        $scope.futureAppointment = []
                        for (var i=0;i<response.data.length;i+=3){
                            $scope.futureAppointment.push(response.data.slice(i,i+3));
                        }
                        console.log($scope.futureAppointment)
                    }
                }, function(response){
                    console.log("failure");
                });
            }
            else{
                $window.location.href="/index.html";
            }
        }
        
        $scope.convert_date = function($date){
            return (new Date($date)).toDateString();
        }

        $scope.logout = function(){
            $window.localStorage.clear();
            $window.location.href="/index.html";
        }

        $scope.edit = function(){
            ModalService.showModal({
            templateUrl: "modals/updatePatient.html",
            controller: "updatePatientController",
            inputs: {
                title: "Update your Profile",
                phone: $scope.phone,
                gender: $scope.gender,
                address: $scope.address,
                designation: $scope.designation
            }
            }).then(function(modal) {
                modal.element.modal();
                modal.close.then(function(result) {
                    console.log("Update ka front end chal rha hai");
                });
            });
        }

        $scope.schedule = function(){
            ModalService.showModal({
                templateUrl: "modals/scheduleAppointment.html",
                controller : "scheduleAppointmentController",
                inputs :{
                    title : "Schedule an Appointment",
                }
            }).then(function(modal){
                modal.element.modal();
                modal.close.then(function(result){
                    console.log("Schedule kaam kar raha hai");
                });
            });
        }
    }
]);