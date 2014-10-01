(function() {
  'use strict';

  function ContentItemCtrl($scope) {
    $scope.getTemplateByType = function() {
      return 'views/' + $scope.type.toLowerCase() + 'Item.html';
    };

    $scope.resetItem = function() {
      $scope.content.reset();
    };

    $scope.showConfig = false;

    $scope.$watch('index()', function() {
      $scope.newIndex = $scope.index().toString();
    });
  }

  function contentItem() {
    return {
      restrict: 'E',
      scope: {
        content: '=',
        type: '@',
        index: '&'
      },
      controller: ContentItemCtrl,
      replace: 'true',
      templateUrl: 'views/contentItem.html',
      require: '^contentList',
      link: function(scope, elem, attrs, ctrl) {
        scope.remove = function() {
          ctrl.remove(scope.index);
        };

        scope.moveUp = function() {
          ctrl.move(scope.index(), scope.index() - 1);
        };

        scope.moveDown = function() {
          ctrl.move(scope.index(), scope.index() + 1);
        };

        scope.moveTo = function(newIndex) {
          ctrl.move(scope.index(), newIndex);
        };

        scope.lastIndex = function() {
          return ctrl.lastIndex();
        };
      }
    };
  }

  angular
    .module('conditionEditorApp')
    .directive('contentItem', contentItem);
})();