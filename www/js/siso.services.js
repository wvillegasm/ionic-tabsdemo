angular.module('siso.services', [])

  .service('SISOService', function ($http, $q) {
    /*var user = {pin: '122156', name: 'WWW', manager: 'XXX', contact: 'DDDD'};
     var sisoRec = {locationId: 0, signInTime: '', signOutTime: '', status: 'Non-Signed', saved: false};*/

    var deferred = $q.defer();

    this.getCurrentUser = function (pin) {
      pin = pin || 0;
      $http.get('http://localhost:3000/user/' + pin).then(function (data) {
        deferred.resolve(data);
      });

      return deferred.promise;
    };

  }).service('RecordService', function ($http, $q) {

  var deferred = $q.defer();
  $http.get('http://localhost:3000/getRecord').then(function (data) {
    deferred.resolve(data);
  });

  this.getCurrentRecord = function () {
    return deferred.promise;
  };

}).service('SaveSISOService', function ($http, $q) {

  var deferred = $q.defer();
  $http.post('http://localhost:3000/saveSISO?par1=one&par2=grrrrr').then(function (data) {
    deferred.resolve(data);
  });

  this.saveSISO = function () {
    return deferred.promise;
  };

});
