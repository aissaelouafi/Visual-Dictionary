var myApp = angular.module('myApp',[]);

myApp.controller('indexController', ['$scope', function($scope) {
  var global_summary;
  $.ajax({
      async: false,
      type: 'GET',
      url: '/api/global_summary',
      dataType: 'json',
      success: function (data) {
        global_summary = data;
      }
  });
  for (var i = 0; i < global_summary.length; i++) {
    global_summary[i]["topic_class"] = global_summary[i].topic.replace(/ /g,'').toLowerCase()
  }
  $scope.topics = global_summary;


}]);

myApp.controller('topicController', ['$scope', function($scope) {
  console.log("Topic details controller ... ")
}]);
