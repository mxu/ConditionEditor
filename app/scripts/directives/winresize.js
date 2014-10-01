(function() {
  'use strict';

  function winResize($window) {
    return function($scope) {
      $scope.setWindowSize = function() {
        $scope.windowHeight = $window.innerHeight;
        $scope.windowWidth = $window.innerWidth;
      };

      angular.element($window).bind('resize', function() {
        $scope.setWindowSize();
        $scope.$apply();
      });

      $scope.setWindowSize();
    };
  }

  angular
    .module('conditionEditorApp')
    .directive('winResize', winResize);
})();