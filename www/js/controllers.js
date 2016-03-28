angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $ionicPopup) {

  $scope.user = {pin:'010101', name:'Doe, John', manager:'Doe, Jane', contact: '888-555-444'};
  $scope.record = {locationId:0, signInTime: '', signOutTime:'', status: 'Non-Signed', saved: false};
  $scope.status = [
    {id: 1, desc: 'Non-Signed'},
    {id: 2, desc: 'Signed-In'},
    {id: 3, desc: 'Signed-Out'},
  ];

  $scope.locations = [
    {id:1, "name":'Operations', "checked":false},
    {id:2, "name":'Altmeyer', "checked":false},
    {id:3, "name":'Annex', "checked":false},
    {id:4, "name":'WOC', "checked":false},
    {id:5, "name":'NCC'},
    {id:6, "name":'East Low Rise', "checked":false},
    {id:7, "name":'East High Rise', "checked":false},
    {id:8, "name":'West Low Rise', "checked":false},
    {id:9, "name":'West High Rise', "checked":false}
  ];

  $scope.myDynamicTimes = function(){
	//set the current time rounded to nearest quarter
	var roundedDate = new Date();
	var rounded = (Math.round(new Date().getMinutes()/15) * 15) % 60;
	roundedDate.setMinutes(rounded);
	
	var d = new Date();
	d.setMinutes(roundedDate.getMinutes()-60)
	var pastTime60 = d.toLocaleTimeString();
	
	d = new Date();
	d.setMinutes(roundedDate.getMinutes()-45)
	var pastTime45 = d.toLocaleTimeString();
	
	d = new Date();
	d.setMinutes(roundedDate.getMinutes()-30)
	var pastTime30 = d.toLocaleTimeString();
	
	d = new Date();
	d.setMinutes(roundedDate.getMinutes()-15)
	var pastTime15 = d.toLocaleTimeString();
	
	d = new Date();
	d.setMinutes(roundedDate.getMinutes()+15)
	var futureTime15 = d.toLocaleTimeString();
	
	d = new Date();
	d.setMinutes(roundedDate.getMinutes()+30)
	var futureTime30 = d.toLocaleTimeString();

	d = new Date();
	d.setMinutes(roundedDate.getMinutes()+45)
	var futureTime45 = d.toLocaleTimeString();

	d = new Date();
	d.setMinutes(roundedDate.getMinutes()+60)
	var futureTime60 = d.toLocaleTimeString();
	
	d = new Date();
	
	$scope.myTimes = [
		{"hour": pastTime60, "checked":false},
		{"hour": pastTime45, "checked":false},
		{"hour": pastTime30, "checked":false},
		{"hour": pastTime15, "checked":false},
		{"hour": roundedDate.toLocaleTimeString(), "checked":false},
		{"hour": futureTime15, "checked":false},
		{"hour": futureTime30, "checked":false},
		{"hour": futureTime45, "checked":false},
		{"hour": futureTime60, "checked":false}
	];
  };

  window.setInterval($scope.myDynamicTimes, 100);

  $scope.submitLabel = 'Sign In';
  $scope.submitColor = 'button-balanced';
  $scope.hideSubmit = false;
  $scope.activeBtn = 0;



  $scope.signIn = function(){
    console.log($scope.record);

    var message = "";
    if($scope.record.status === 'Non-Signed'){
      message = "You will not be able to change the Location and Sign-In Time after submit";
    }else{
      message = "Please confirm your Signing-out";
    }

    var confirmPopup = $ionicPopup.confirm({
      title: '<b>Submitting Time</b>',
      template: message
    });

    confirmPopup.then(function(res) {
      if(res) {
        if($scope.record.status === 'Non-Signed') {
          $scope.record.saved = true;
          $scope.record.status = "Signed-In";
          $scope.submitLabel = 'Sign Out';
          $scope.submitColor = 'button-assertive';

          $scope.resetTimes();

          // TODO save to server

        }else if($scope.record.status === 'Signed-In'){
          $scope.record.status = "Signed-Out";
          $scope.hideSubmit = true;

          // TODO save to server
        }else{

        }
      } else {
        // console.log('Cancel');

      }
    });


  };

  $scope.enableSubmit = function(){
    return ($scope.record.status === 'Non-Signed' && $scope.record.locationId > 0 && $scope.record.signInTime.length > 0) ||
      ($scope.record.status === 'Signed-In' && $scope.record.signOutTime.length > 0 )
  };

  $scope.selectLocation = function (locEl) {
    if($scope.record.status !== 'Non-Signed') return;
    angular.forEach($scope.locations, function (el) {
      el.checked = false;
    });

    locEl.checked = !locEl.checked;
    $scope.record.locationId = locEl.id;

  };

  $scope.singInTime = function (timeEl) {
    $scope.resetTimes();
    timeEl.checked = true;
    $scope.record.signInTime = timeEl.hour;
  };

  $scope.singOutTime = function (timeEl) {
    $scope.resetTimes();
    timeEl.checked = true;
    $scope.record.signOutTime = timeEl.hour;
  };

  $scope.resetTimes = function () {
    angular.forEach($scope.myTimes, function (el) {
      el.checked = false;
    });
  };

  $scope.resetLocations = function () {
    angular.forEach($scope.locations, function (el) {
      el.checked = false;
    });
  };

  $scope.resetForm = function () {
    $scope.resetTimes();
    $scope.resetLocations();

	$scope.submitLabel = 'Sign In';
	$scope.submitColor = 'button-balanced';

    $scope.record = {locationId:0, signInTime: '', signOutTime:'', status: 'Non-Signed', saved: false};
  };





})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
