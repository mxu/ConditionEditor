(function() {
  'use strict';

  function ConditionList($q) {
    var files = [
      'AbdominalAorticAneurysm',
      'Adoption_(evaluation)',
      'Bell_Lieberman_Scoliosis',
      'Bell_Lieberman_SpinalInfection',
      'Bell_Lieberman_VertebralFracture',
      'Bell_Mazanec_AnkylosingSpondylitis',
      'Benzel_ChiariMalformation',
      'BreastCancerReconstruction',
      'Calabrese_CNSVasculitis',
      'CancerNutrition',
      'Cardiology_CardiacCatheterization',
      'Cardiology_Echocardiogram',
      'Cardiology_TransesophagealEchocardiogram',
      'Carey_McCullough_AutoimmuneHepatitis',
      'Carey_PrimaryBiliaryCirrhosis',
      'CreutzfeldtJakob',
      'Decamp_Esophagealcancer',
      'Decamp_Malignantmediastinalmass',
      'Deitcher_Lichtin_Polycythemia',
      'Dementia',
      'Dyspareunia',
      'EndometrialCa',
      'Falcone_Attaran_Infertility',
      'Fazio_Sengore_Church_AnalIncontinence',
      'FetalMedicine',
      'Fibroid',
      'Flushing',
      'HealthyLifestyle',
      'HeartDisease',
      'HeartFailure',
      'Ianotti_Shoulder',
      'InducedHeartFailure',
      'IntestinalTransplant',
      'Kalaycio_Leukemia',
      'Lichitin_Anemia1',
      'LungCancer',
      'MaleInfertility',
      'MigraineHeadache',
      'Morbid_Obesity',
      'MovementDisorders',
      'Mycobacterium',
      'NormalPressureHydrocephalus',
      'CancerNutritionOBConsults',
      'Olencki_AnalCanalCancer',
      'P2PLite',
      'PlasticSurgeryAbdomen',
      'PlasticSurgeryEye',
      'PulmonaryVeinStenosis',
      'Scheuermannsdisease',
      'Sinusitis',
      'Siperstein_Henderson_MetastaticLiverCancer',
      'Skin_Disorders_No_Path',
      'SleepDisorders',
      'Stevens_Pancreatitis',
      'Tobacco_Dependence',
      'VocalCordParalysis',
      'Zanotti_Markman_OvarianCancer'
    ];

    function getFiles() {
      var deferred = $q.defer();

      /**
       * Replace with API call to get file list
       */
      setTimeout(function() {
        if(files.length > 0) {
          deferred.resolve(files);
        } else {
          deferred.reject('No files');
        }
      }, 1000);

      return deferred.promise;
    }

    return {
      getFiles: getFiles
    };
  }

  angular
    .module('conditionEditorApp')
    .factory('ConditionList', [
      '$q',
      ConditionList
    ]);
})();