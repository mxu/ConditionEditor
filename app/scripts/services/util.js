(function() {
  'use strict';

  function Util() {
    function uncamel(str) {
      return str
        .replace(/\_/g, '') // remove underscore
        .replace(/([A-Z0-9]+)/g, ' $1') // insert space before caps and numbers
        .replace(/^./, function(str){ return str.toUpperCase(); }); // uppercase first char
    }

    function forceArray(obj) {
      if(!obj) { return []; }
      if(obj instanceof Array) { return obj; }
      return [obj];
    }

    return {
      uncamel: uncamel,
      forceArray: forceArray
    };
  }

  angular
    .module('conditionEditorApp')
    .factory('Util', Util);
})();