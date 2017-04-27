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
  var QueryString = function () {
    // This function is anonymous, is executed immediately and
    // the return value is assigned to QueryString!
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
      var pair = vars[i].split("=");
          // If first entry with this name
      if (typeof query_string[pair[0]] === "undefined") {
        query_string[pair[0]] = decodeURIComponent(pair[1]);
          // If second entry with this name
      } else if (typeof query_string[pair[0]] === "string") {
        var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
        query_string[pair[0]] = arr;
          // If third or later entry with this name
      } else {
        query_string[pair[0]].push(decodeURIComponent(pair[1]));
      }
    }
    return query_string;
  }();
  var topic = QueryString.name
  $scope.topic = topic.toUpperCase();

  var topics_details;
  var subtopics = [];
  $.ajax({
    async:false,
    type:'GET',
    url:'/api/sub_topics/'+topic,
    dataType:'json',
    success: function(data){
      topics_details = data;
    }
  });
  function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
  }
  for (var i = 0; i < topics_details.length; i++) {
    subtopics.push(capitalizeFirstLetter(topics_details[i].subtopic))
    topics_details[i]["subtopic"] = capitalizeFirstLetter(topics_details[i].subtopic)
  }

  $scope.subtopics = subtopics;
  $scope.nbsubtopics = subtopics.length;
  $scope.topics_details = topics_details;



}]);
