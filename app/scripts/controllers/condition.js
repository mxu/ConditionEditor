(function() {
  'use strict';

  function ConditionCtrl($scope, $routeParams, $q, DataTransform, Util){
    $scope.loading = true;
    $scope.uncamel = Util.uncamel;
    $scope.errorMessage = null;
    $scope.cData = null;

    $scope.conditionName = $routeParams.conditionName;
    // load xml data
    $q.all([
      DataTransform.xmlToJson($scope.conditionName),
      DataTransform.xmlToJson($scope.conditionName + 'MaterialList'),
      DataTransform.xmlToJson($scope.conditionName + 'Questionnaire')
    ]).then(function(data) {
      $scope.loading = false;
      $scope.cData = window.c = data[0];
      $scope.cData.materials = data[1];
      $scope.cData.questionGroups = data[2];
    }, function(reason) {
      $scope.loading = false;
      $scope.errorMessage = reason;
    });
  }

  angular
    .module('conditionEditorApp')
    .controller('ConditionCtrl', [
      '$scope',
      '$routeParams',
      '$q',
      'DataTransform',
      'Util',
      ConditionCtrl
    ]);
})();