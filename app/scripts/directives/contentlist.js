(function() {
  'use strict';

  function ContentListCtrl($scope, $injector) {
    $scope.Item = $injector.get($scope.type);

    $scope.add = function() {
      $scope.content.push(new $scope.Item());
    };

    this.remove = function(index) {
      $scope.content.splice(index, 1);
    };

    this.move = function(index, newIndex) {
      var temp = $scope.content.splice(index, 1);
      $scope.content.splice(newIndex, 0, temp[0]);
    };

    this.lastIndex = function() {
      return $scope.content.length - 1;
    };
  }

  function contentList() {
    return {
      restrict: 'E',
      scope: {
        content: '=',
        type: '@'
      },
      controller: ContentListCtrl,
      replace: 'true',
      templateUrl: 'views/contentList.html'
    };
  }

  angular
    .module('conditionEditorApp')
    .directive('contentList', ['$injector', contentList]);
})();