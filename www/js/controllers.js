angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {

  $scope.user = {pin:'001111', name:'Doe, John', manager:'Doe, Jane', contact: '888-555-444'};
  $scope.record = {location: 'Operations', signintime:'', signouttime:'', saved: false};
  $scope.locations = ['Operations','Altmeyer','Annex','WOC','NCC','East Low Rise','East High Rise','West Low Rise','West High Rise'];
  $scope.myTimes = ['1:00 PM','2:00 PM','3:00 PM','4:00 PM'];
  $scope.submitLabel = 'Sign In';
  $scope.submitColor = 'button-balanced';
  $scope.hideSubmit = false;

  $scope.timesh = function(){
    return ['1:00 PM','2:00 PM','3:00 PM','4:00 PM'];
  };

  $scope.signIn = function(){
    console.log($scope.record);

    if(!$scope.record.saved){
      $scope.record.saved = true;
      $scope.submitLabel = 'Sign Out';
      $scope.submitColor = 'button-assertive';
    }else{
      $scope.hideSubmit = true;
    }
  };

  $scope.showSignout = function(){
    return $scope.record.signintime.length > 0 && $scope.record.saved;
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
