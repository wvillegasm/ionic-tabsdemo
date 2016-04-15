angular.module('starter.controllers', ['ionic'])

  .controller('DashCtrl', ['$scope', '$ionicPopup', '$interval', '$ionicLoading', 'SISO', 'UserFactory',
    function ($scope, $ionicPopup, $interval, $ionicLoading, SISO, UserFactory) {

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

      $scope.myTimes = [];

      $scope.submitLabel = 'Sign In';
      $scope.submitColor = 'button-balanced';
      $scope.hideSubmit = false;
      $scope.activeBtn = 0;


      $scope.myDynamicTimes = function () {

        var currentTime = new Date();
        currentTime.setMinutes(-30);
        var curMinute = currentTime.getMinutes();
        var rawQuarter = precision(curMinute / 15);
        var quarter = Math.ceil(rawQuarter);
        if (quarter === 0) quarter = 1;

        if (rawQuarter <= 3) {
          currentTime.setMinutes(quarter * 15, 0, 0);
        } else {
          currentTime.setHours(currentTime.getHours() + 1, 0, 0, 0);
        }

        // creates times for every lapse of times (15 minutes --> [1000 * 60 * 15])
        if ($scope.myTimes.length === 0 || getLapseOfTime(currentTime) !== $scope.myTimes[0]['hour']) {
          for (var i = 0; i < 8; i++) {
            $scope.myTimes[i] = {"hour": getLapseOfTime(currentTime), "checked": false};
            currentTime = new Date(currentTime.getTime() + (1000 * 60 * 15));
          }
        }

        function precision(n) {
          return (n * 100) / 100;
        }

        function getLapseOfTime(date) {
          return date.toLocaleTimeString().replace(/:\d+ /, ' ');
        }

      };


      // calculate for first-time
      $scope.myDynamicTimes();

      // recalculate every 5 min ---> [1000 * 60 * 5]
      $interval($scope.myDynamicTimes, 1000 * 60 * 1);

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

              //$scope.record.saved = true;
              $scope.record.status = "Signed-In";
              $scope.record.pin = $scope.user.pin;
              $scope.submitLabel = 'Sign Out';
              $scope.submitColor = 'button-assertive';

              $scope.resetTimes();

              console.log('User on Factory: ', UserFactory.get());
              console.log('User on Controller: ', $scope.user);

              if (UserFactory.get().pin === "") {
                SISO.saveUser($scope.user, function (userRec) {
                  if (userRec.success && userRec.record !== null) {
                    UserFactory.set({
                      pin: $scope.user.pin,
                      name: $scope.user.name,
                      manager: $scope.user.manager,
                      contact: $scope.user.contact
                    });
                  }
                });
              }

              // TODO save to server
              SISO.save($scope.record, function (record) {
                if (record.success) {
                  if (record.records.length > 0) {
                    var r = record.records[0];
                    $scope.record['_id'] = r['_id'];
                    $scope.record['__v'] = r['__v'];

                  }
                }


              });

            } else if ($scope.record.status === 'Signed-In') {
              $scope.record.status = "Signed-Out";
              $scope.hideSubmit = true;

              // TODO save to server
              SISO.update($scope.record, function (result) {
                if (result.ok === 1) {
                  $ionicLoading.show({template: 'Saved!', noBackdrop: true, duration: 2000});
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
          if (locEl === el.id) locEl = el;
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
        console.log('User on Factory', UserFactory.get());
        if (typeof keyCode.srcElement.value !== 'undefined' && keyCode.srcElement.value.length === 6) {

          console.log('User on Factory', UserFactory.get());
          console.log('PIN Captured', keyCode.srcElement.value);

          if (UserFactory.get().pin !== keyCode.srcElement.value) {
            SISO.getUser({pin: keyCode.srcElement.value}, function (user) {
              if (user.success && user.record !== null) {
                UserFactory.set({
                  pin: user.record.pin,
                  name: user.record.name,
                  manager: user.record.manager,
                  contact: user.record.contact
                });
                $scope.user = user.record;
              } else {
                UserFactory.set({pin: "", name: "", manager: "", contact: ""});
                $scope.user = {pin: keyCode.srcElement.value, name: "", manager: "", contact: ""};
              }
            });
          } else {
            $scope.user = UserFactory.get();
          }

          SISO.get({pin: keyCode.srcElement.value, status: 'Signed-In'}, function (record) {
            if (record.success && record.records[0]) {
              $scope.selectLocation(record.records[0]['locationId']);
              $scope.record = record.records[0];
            }
          });

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

  .controller('ChatsCtrl', function ($scope, SISO, UserFactory) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    var pin = UserFactory.get().pin;
    $scope.records = [];


    $scope.loadRecords = function () {
      SISO.list({pin: pin}, function (record) {
        if (record.success && record.records.length > 0) {
          $scope.records = record.records;
        }
      });
    };

    if (pin) {
      $scope.loadRecords();
    }

  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('AccountCtrl', function ($scope) {
    $scope.settings = {
      enableFriends: true
    };
  });
