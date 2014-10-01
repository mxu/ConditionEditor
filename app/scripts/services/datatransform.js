(function (){
  'use strict';

  function DataTransform($q, $http, $injector, x2js, Util) {
    // load an xml resource and promise it as a json object
    function xmlToJson(filename) {
      var deferred = $q.defer();
      var filetype = (function() {
        if(filename.indexOf('Questionnaire') > -1) { return 'q'; }
        if(filename.indexOf('MaterialList') > -1) { return 'm'; }
        return 'c';
      })();

      $http
        .get('data/' + filename + '.xml')
        .then(function(response) {
          // entities mess up parsing, so convert them into element nodes
          var xmlData = response.data.replace(/(^\s*)\&(\w+)\;/gm, '$1<ENTITY text="$2"/>');

          // homogenize child nodes to maintian ordering during conversion
          var parser = new DOMParser();
          var xmlDOM = parser.parseFromString(xmlData, 'text/xml');
          switch(filetype) {
          case 'c':
            xmlDOM = homogenizeChildren(xmlDOM, 'condition', 'CONDITION_ITEM');
            break;
          case 'm':
            xmlDOM = homogenizeChildren(xmlDOM, 'material_list', 'MATERIAL_ITEM');
            break;
          }
          xmlData = new XMLSerializer().serializeToString(xmlDOM);

          // convert to json
          var jsonData = x2js.xml_str2json(xmlData);

          // reject on failed conversion (in case x2js doesn't throw an error)
          if(jsonData === null) {
            deferred.reject(filename + '.xml failed to convert to JSON');
          }

          // format json object for easier manipulation
          switch(filetype) {
          case 'c':
            jsonData = formatCondition(jsonData);
            break;
          case 'm':
            jsonData = formatMaterial(jsonData);
            break;
          case 'q':
            jsonData = formatQuestionGroup(jsonData);
            break;
          }

          // resolve converted data
          deferred.resolve(jsonData);
        }, function(response) {
          deferred.reject(filename + '.xml: ' + response.statusText + ' (' + response.status + ')');
        });

      return deferred.promise;
    }

    function formatCondition(jsonData) {
      var Condition = $injector.get('Condition');
      var result = {};
      result.division = jsonData.division._name;
      result.department = jsonData.division.department._name;
      result.section = jsonData.division.department.section._name;
      result.conditions = [];

      jsonData.division.department.section.condition = Util.forceArray(jsonData.division.department.section.condition);
      for(var i = 0; i < jsonData.division.department.section.condition.length; i++) {
        var cItem = jsonData.division.department.section.condition[i];
        cItem.CONDITION_ITEM = Util.forceArray(cItem.CONDITION_ITEM);
        result.conditions.push(new Condition(cItem));
      }

      return result;
    }

    function formatMaterial(jsonData) {
      var Material = $injector.get('Material');
      var result = [];

      jsonData.material_list.MATERIAL_ITEM = Util.forceArray(jsonData.material_list.MATERIAL_ITEM);
      for(var i = 0; i < jsonData.material_list.MATERIAL_ITEM.length; i++) {
        var mItem = jsonData.material_list.MATERIAL_ITEM[i];
        result.push(new Material(mItem));
      }

      return result;
    }

    function formatQuestionGroup(jsonData) {
      var QuestionGroup = $injector.get('QuestionGroup');
      var result = [];

      jsonData.questionnaire.question_group = Util.forceArray(jsonData.questionnaire.question_group);
      for(var i = 0; i < jsonData.questionnaire.question_group.length; i++) {
        var qgItem = jsonData.questionnaire.question_group[i];
        result.push(new QuestionGroup(qgItem));
      }

      return result;
    }

    // change all children of the parent node to have the same node names
    // and store original name as a new attribute
    function homogenizeChildren(xmlDOM, parentName, childName) {
      // find the parent node
      var parents = xmlDOM.getElementsByTagName(parentName);
      for(var i = 0; i < parents.length; i++) {
        // iterate over child elements
        var node = parents[i].firstChild;
        while(node) {
          // skip non-element nodes
          if(!(node instanceof Element)) {
            node = node.nextSibling;
            continue;
          }
          // create a new standardized node
          var newNode = xmlDOM.createElement(childName);
          // copy attributes
          var attrs = node.attributes;
          for(var j = 0; j < attrs.length; j++) {
            newNode.setAttribute(attrs[j].name, attrs[j].value);
          }
          // store original name
          newNode.setAttribute('nodeName', node.nodeName);
          // replace the node
          var nextNode = node.nextSibling;
          node.parentNode.replaceChild(newNode, node);
          node = nextNode;
        }
      }
      return xmlDOM;
    }

    return {
      xmlToJson: xmlToJson
    };
  }

  angular
    .module('conditionEditorApp')
    .factory('DataTransform', [
      '$q',
      '$http',
      '$injector',
      'x2js',
      'Util',
      DataTransform
    ]);
})();