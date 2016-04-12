angular.module('starter.controllers', ['ionic'])

  .controller('DashCtrl', ['$scope', '$ionicPopup', '$http', '$ionicLoading', 'SISO',
    function ($scope, $ionicPopup, $http, $ionicLoading, SISO) {

    $scope.user = {pin: "", name: "", manager: "", contact: ""};
    $scope.record = {status: 'Non-Signed', signInTime: '', signOutTime: '', locationId: 0};


    //var recordPromise = RecordService.getCurrentRecord();

    $scope.status = [
      {id: 1, desc: 'Non-Signed'},
      {id: 2, desc: 'Signed-In'},
      {id: 3, desc: 'Signed-Out'}
    ];

    $scope.locations = [
      {id: 1, "name": 'Operations', "checked": false},
      {id: 2, "name": 'Altmeyer', "checked": false},
      {id: 3, "name": 'Annex', "checked": false},
      {id: 4, "name": 'WOC', "checked": false},
      {id: 5, "name": 'NCC', "checked": false},
      {id: 6, "name": 'East Low Rise', "checked": false},
      {id: 7, "name": 'East High Rise', "checked": false},
      {id: 8, "name": 'West Low Rise', "checked": false},
      {id: 9, "name": 'West High Rise', "checked": false}
    ];

    $scope.myTimes = [
      {"hour": '1:00 PM', "checked": false},
      {"hour": '2:00 PM', "checked": false},
      {"hour": '3:00 PM', "checked": false},
      {"hour": '4:00 PM', "checked": false}
    ];

    $scope.submitLabel = 'Sign In';
    $scope.submitColor = 'button-balanced';
    $scope.hideSubmit = false;
    $scope.activeBtn = 0;

    $scope.signIn = function () {

      var message = "";
      if ($scope.record.status === 'Non-Signed') {
        message = "You will not be able to change the Location and Sign-In Time after submit";
      } else {
        message = "Please confirm your Signing-out";
      }

      var confirmPopup = $ionicPopup.confirm({
        title: '<b>Submitting Time</b>',
        template: message
      });

      confirmPopup.then(function (res) {
        if (res) {
          if (typeof $scope.record['_id'] === 'undefined') {

            $scope.record.saved = true;
            $scope.record.status = "Signed-In";
            $scope.record.pin = $scope.user.pin;
            $scope.submitLabel = 'Sign Out';
            $scope.submitColor = 'button-assertive';

            $scope.resetTimes();

            // TODO save to server
            SISO.save($scope.record, function(record){
              if(record.success){
                if(record.records.length > 0){
                  var r = record.records[0];
                  $scope.record['_id'] = r['_id'];
                  $scope.record['__v'] = r['__v'];
                }
              }
              console.log('Result of saving ',record);
              console.log('Current Record ',$scope.record);
            });

          } else if ($scope.record.status === 'Signed-In') {
            $scope.record.status = "Signed-Out";
            $scope.hideSubmit = true;

            // TODO save to server
            SISO.update($scope.record, function(result){
              if(result.ok === 1){
                $ionicLoading.show({ template: 'Saved!', noBackdrop: true, duration: 2000 });
              }
            });
          } else {

          }
        } else {
          // console.log('Cancel');

        }
      });


    };

    $scope.enableSubmit = function () {
      return ($scope.record.status === 'Non-Signed' &&
        (typeof $scope.user.pin !== 'undefined' && $scope.user.pin.length > 0) &&
        (typeof $scope.user.name !== 'undefined' && $scope.user.name.length > 0) &&
        (typeof $scope.user.manager !== 'undefined' && $scope.user.manager.length > 0) &&
        $scope.record.locationId > 0 &&
        $scope.record.signInTime.length > 0) ||
        ($scope.record.status === 'Signed-In' && $scope.record.signOutTime.length > 0 )
    };

    $scope.selectLocation = function (locEl) {
      if ($scope.record.status !== 'Non-Signed') return;

      angular.forEach($scope.locations, function (el) {
        el.checked = false;
        if(locEl === el.id) locEl = el;
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

      $scope.record = {locationId: 0, signInTime: '', signOutTime: '', status: 'Non-Signed', saved: false};
    };

    $scope.onPINKeyup = function (keyCode) {

      if (typeof keyCode.srcElement.value !== 'undefined' && keyCode.srcElement.value.length === 6) {
        console.info('KeyUp', keyCode);

        SISO.get({pin: keyCode.srcElement.value, status: 'Signed-In'}, function(record){
          if(record.success && record.records[0]){
            $scope.selectLocation(record.records[0]['locationId']);
            $scope.record = record.records[0];
          }
          console.log('What I get: ', record);
        });

        /*var userPromise = SISOService.getCurrentUser(keyCode.srcElement.value);
        userPromise.then(function (user) {
          console.log('Success:', user.data);
          $scope.user = user.data;
        }, function (err) {
          console.error('Error: ', err);
        });
        */
      }
    };

    $scope.onPINKeydown = function (keyCode) {

      if (keyCode.keyCode !== 9 &&
        keyCode.keyCode !== 8 &&
        typeof $scope.user.pin !== 'undefined' &&
        $scope.user.pin.length >= 6) {
        keyCode.preventDefault();
      }
    }

  }])

  .controller('ChatsCtrl', function ($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function (chat) {
      Chats.remove(chat);
    };
  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('AccountCtrl', function ($scope) {
    $scope.settings = {
      enableFriends: true
    };
  });
