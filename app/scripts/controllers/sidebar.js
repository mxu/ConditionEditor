(function() {
  'use strict';

  function SidebarCtrl($scope, $location, ConditionList, Util) {
    $scope.isActive = function(condition) {
      return condition === $location.path().substring(11);
    };

    $scope.doFilter = function(str) {
      if(str === '') {
        $scope.conditions = $scope.allConditions;
      } else {
        var frags = str.split(' ');
        var filtered = $scope.allConditions.filter(function(condition) {
          var result = true;
          for(var i in frags) {
            result = result && condition.toLowerCase().indexOf(frags[i].toLowerCase()) !== -1;
          }
          return result;
        });
        $scope.conditions = filtered;
      }
    };

    $scope.hasSearchStr = function() {
      return !!$scope.searchStr && $scope.searchStr !== '';
    };

    $scope.clearSearch = function() {
      $scope.searchStr = '';
      $scope.doFilter($scope.searchStr);
    };

    $scope.allConditions = [];  // list of all conditions
    $scope.conditions = [];     // filtered list of conditions to display
    $scope.searchStr = '';

    $scope.uncamel = Util.uncamel;

    ConditionList.getFiles()
      .then(function(files) {
        $scope.allConditions = files;
        $scope.conditions = $scope.allConditions;
      }, function(reason) {
        console.log('Failed: ' + reason);
      });

  }

  angular
    .module('conditionEditorApp')
    .controller('SidebarCtrl', [
      '$scope',
      '$location',
      'ConditionList',
      'Util',
      SidebarCtrl
    ]);
})();