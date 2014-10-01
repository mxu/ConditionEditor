(function() {
  'use strict';

  angular
    .module('conditionEditorApp')
    .factory('QuestionGroup', [
      'Util',
      'Question',
      function(Util, Question) {

        /*** jsonData format ***
        {
          _name: <string>,
          question: [<Question>]
        }
        ***/
        function QuestionGroup(jsonData) {
          this.name = jsonData._name;
          this.questions = [];

          jsonData.question = Util.forceArray(jsonData.question);
          for(var i = 0; i < jsonData.question.length; i++) {
            var qItem = jsonData.question[i];
            this.questions.push(new Question(qItem));
          }
        }

        return QuestionGroup;
      }
    ]);
})();