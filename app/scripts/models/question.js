(function() {
  'use strict';

  angular
    .module('conditionEditorApp')
    .factory('Question', [
      'Util',
      function(Util) {

        /*** jsonData format ***
        {
          _prompt: <string>,
          _mandatory: <'true', 'false'>,
          free_form_response: {
            _height: <string>
          }
          --- OR ---
          table_response: {
            _initial_rows_to_display: <string>,
            _add_row_increment: <string>,
            _row_height: <string>,
            _column_definitions: {
              _column_definition: [
                {
                  _label: <string>
                  _width: <string>
                },...
              ]
            },
            _table_data: [
              {
                cell: [<string>]
              },...
            ]
          }
          --- OR ---
          item_response: {
            _drop_down_style: <'true', 'false'>,
            _single_response: <'true', 'false'>,
            selection: [
              {
                _selected: 'false',
                _text: <string>,
                question: [<Question>]
              },...
            ]
          }
        }
        ***/
        function Question(jsonData) {
          var i = 0;
          var res = null;
          // every question has prompt and mandatory fields
          this.prompt = jsonData._prompt;
          this.mandatory = Boolean(jsonData._mandatory);
          // determine reponse type by presence of response property
          this.type = (function() {
            if(jsonData.hasOwnProperty('free_form_response')) {
              res = jsonData.free_form_response;
              return 'freeform';
            } else if(jsonData.hasOwnProperty('table_response')) {
              res = jsonData.table_response;
              return 'table';
            } else if(jsonData.hasOwnProperty('item_response')) {
              res = jsonData.item_response;
              return 'item';
            } else if(jsonData.hasOwnProperty('ENTITY')) {
              res = jsonData.ENTITY;
              return 'ENTITY';
            } else {
              console.log(jsonData);
              throw new TypeError('Type must be freeform, table, item, or ENTITY');
            }
          })();
          // create type specific properties
          switch(this.type) {
          case 'freeform':
            // copy height property
            this.height = res._height;
            break;
          case 'table':
            // copy simple properties
            this.initialRowsToDisplay = parseInt(res._initial_rows_to_display, 10);
            this.addRowIncrement = parseInt(res._add_row_increment, 10);
            this.rowHeight = parseInt(res._row_height || '1', 10);
            this.columnDefinitions = [];
            this.firstColumn = [];

            // convert column definitions into an array of objects
            // specifying the column label and width
            res.column_definitions._column_definition = Util.forceArray(res.column_definitions._column_definition);
            for(i = 0; i < res.column_definitions._column_definition.length; i++) {
              var col = res.column_definitions._column_definition[i];
              this.columnDefinitions.push({
                label: col._label,
                width: parseInt(col._width || '20', 10)
              });
            }

            if(!res.hasOwnProperty('_table_data')) { break; }
            // convert table data property into an array of row
            // headings to display in the first column
            res._table_data = Util.forceArray(res._table_data);
            for(i = 0; i < res._table_data.length; i++) {
              var row = res._table_data[i];
              row.cell = Util.forceArray(row.cell);
              this.firstColumn.push(row.cell[0]);
            }
            break;
          case 'item':
            // copy simple properties
            this.dropDownStyle = Boolean(res._drop_down_style);
            this.singleResponse = Boolean(res._single_response);
            this.selection = [];

            // convert selection into an array of objects
            // specifying the option label and an array of subquestions
            res.selection = Util.forceArray(res.selection);
            for(i = 0; i < res.selection.length; i++) {
              var sel = res.selection[i];
              var subQuestions = [];

              // convert subquestions into an array of Question objects
              sel.question = Util.forceArray(sel.question);
              for(var j = 0; j < sel.question.length; j++) {
                var subQ = sel.question[j];
                subQuestions.push(new Question(subQ));
              }

              // create question object and push to array
              this.selection.push({
                text: sel._text,
                question: subQuestions
              });
            }
            break;
          case 'ENTITY':
            // copy text property
            this.text = res._text;
            break;
          }
        }

        Question.prototype.clearData = function() {
          if(this.type !== 'freeform') {
            delete this.height;
          }

          if(this.type !== 'table') {
            delete this.initialRowsToDisplay;
            delete this.addRowIncrement;
            delete this.rowHeight;
            delete this.columnDefinitions;
          }

          if(this.type !== 'item') {
            delete this.dropDownStyle;
            delete this.singleResponse;
            delete this.selection;
          }

          if(this.type !== 'ENTITY') {
            delete this.text;
          }
        };

        Question.prototype.reset = function() {
          this.clearData();

          switch(this.type) {
          case 'freeform':
            this.height = 3;
            break;
          case 'table':
            this.initialRowsToDisplay = 3;
            this.addRowIncrement = 1;
            this.rowHeight = 1;
            this.columnDefinitions = [
              {
                label: '',
                width: 20
              }
            ];
            break;
          case 'item':
            this.dropDownStyle = false;
            this.singleResponse = false;
            this.selection = [
              {
                text: '',
                questions: []
              }
            ];
            break;
          case 'ENTITY':
            this.text = '';
            break;
          default:
            throw new TypeError('Type must be freeform, table, item, or entity');
          }
        };

        Question.prototype.addColumn = function() {
          this.columnDefinitions.push({
            label: 'column ' + (this.columnDefinitions.length + 1),
            width: 20
          });
        };

        Question.prototype.removeColumn = function() {
          this.columnDefinitions.splice(this.columnDefinitions.length - 1, 1);
        };

        Question.prototype.setCols = function(n) {
          try {
            n = parseInt(n, 10);
          } catch(err) {
            return;
          }

          while(this.columnDefinitions.length < n) {
            this.addColumn();
          }

          while(this.columnDefinitions.length > n) {
            this.removeColumn();
          }
        };

        return Question;
      }
    ]);
})();