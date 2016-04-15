angular.module('starter.services', ['ngResource', 'ngStorage'])
.factory('SISO', function($resource){

      return $resource('/siso', {}, {
        save : {method: 'POST', cache: false, responseType: 'json'},
        get : {method: 'GET', url: '/siso/:pin/status/:status', params: {pin : '@pin', status: '@status'}, cache: false, responseType : 'json' },
        update : {method: 'PUT', url: '/siso/id/:id', params: {id:'@_id'},responseType: 'json'},
        list : {method: 'GET', url: '/siso/list/:pin', params: {pin:'@pin'}, responseType: 'json'},
        getUser : {method: 'GET', url: '/siso/user/:pin', params: {pin:'@pin'}, responseType: 'json'},
        saveUser : {method: 'POST', url: '/siso/user', cache: false, responseType: 'json'}
      });
})
.factory('UserFactory', function ($localStorage) {

  $localStorage = $localStorage.$default({
    userData : {pin: "", name: "", manager: "", contact: ""}
  });

  var saveUser = function (user) {
    $localStorage.userData = user;
  };

  var getUser = function () {
    return $localStorage.userData;
  };

  return {
    set : saveUser,
    get : getUser
  };
})
.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
