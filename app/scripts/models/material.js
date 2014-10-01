(function() {
  'use strict';

  angular
    .module('conditionEditorApp')
    .factory('Material', function() {

      /*** jsonData format ***
      {
        _nodeName: 'ENTITY',
        _text: <string>
      }
      --- OR ---
      {
        _nodeName: 'material',
        _id: <string>,
        _description: <string>,
        _mandatory: <'true', 'false'>
      }
      --- OR ---
      {
        _nodeName: 'instruction',
        _text: <string>
      }
      ***/
      function Material(jsonData) {
        this.type = jsonData._nodeName;
        switch(this.type) {
        case 'material':
          this.id = jsonData._id;
          this.description = jsonData._description;
          this._mandatory = Boolean(jsonData._mandatory);
          break;
        case 'instruction':
        case 'ENTITY':
          this.text = jsonData._text;
          break;
        default:
          throw new TypeError('Type must be material, instruction, or ENTITY');
        }
      }

      Material.prototype.clearData = function() {
        if(this.type !== 'material') {
          delete this.id;
          delete this.description;
          delete this.mandatory;
        }

        if(this.type !== 'instruction' && this.type !== 'ENTITY') {
          delete this.text;
        }
      };

      Material.prototype.reset = function() {
        this.clearData();
        
        switch(this.type) {
        case 'material':
          this.id = '';
          this.description = '';
          this.mandatory = true;
          break;
        case 'instruction':
        case 'ENTITY':
          this.text = '';
          break;
        default:
          throw new TypeError('Type must be material, instruction, or ENTITY');
        }
      };

      return Material;

    });
})();