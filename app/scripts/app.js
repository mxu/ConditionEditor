(function() {
  'use strict';

  function config($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/condition/:conditionName', {
        templateUrl: 'views/condition.html',
        controller: 'ConditionCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }

  angular
    .module('conditionEditorApp', [
      'ngAnimate',
      'ngRoute',
      'duScroll',
      'cb.x2js'
    ])
    .config(config);
})();