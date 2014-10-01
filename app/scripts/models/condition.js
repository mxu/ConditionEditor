(function() {
  'use strict';

  angular
    .module('conditionEditorApp')
    .factory('Condition', function() {

      /*** jsonData format ***
      {
        _description: <string>,
        _id: <string>,
        _cost: <string>,
        CONDITION_ITEM: [
          {
            _nodeName: <'keyword', 'ENTITY'>,
            _text: <string>
          },...
        ]
      }
      ***/
      function Condition(jsonData) {
        this.id = jsonData._description;
        this.cost = jsonData._cost;
        this.keywords = [];
        this.entityList = [];

        for(var i = 0; i < jsonData.CONDITION_ITEM.length; i++) {
          var item = jsonData.CONDITION_ITEM[i];
          if(item._nodeName === 'keyword') {
            this.keywords.push(item._text);
          } else if(item._nodeName === 'ENTITY') {
            this.entityList.push(item._text);
          }
        }
      }

      return Condition;

    });
})();