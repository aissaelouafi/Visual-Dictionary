var myApp = angular.module('myApp',[]);


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
  var topic = QueryString.name.toLowerCase()
  var page = QueryString.page
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


  var topic_image = "contents/images/croped_images/"+topic.toUpperCase()+"/"+page+"_0.png".replace(" ","\ ")
  $scope.topic_image = topic_image
  $scope.topic_page = page
  console.log(topic_image)
}]);

myApp.controller('subtopicController',['$scope',function($scope){
  var token = "a33083f6-c493-4fc5-a1af-a3c111023fde-843339462"
  var tagme_url = "https://tagme.d4science.org/tagme/tag?lang=en&gcube-token="+token

  console.log('sub topic controller ... ')
  var subtopic = QueryString.subtopic;
  console.log(subtopic)
  var topic_description = [];
  $.ajax({
    async:false,
    type:'GET',
    url:'/api/subtopic_details/'+subtopic,
    dataType:'json',
    success: function(data){
      topic_description = data;
    }
  });



  var request = tagme_url+"&text="+topic_description[0]["description"].toString().replace(/_RL_/g,"")+"&include_abstract=true&include_categories=true";
  var tagme_result;
  $.ajax({
      async:false,
      url: request,
      cache: true,
      success: function(data) {
        tagme_result = data
      },
      error: function (data, status, error) {
        console.log('error', data, status, error);
      }
  });



  var babel_result = []
  var babel_url = "https://babelfy.io/v1/disambiguate?text="+topic_description[0]["description"].toString().replace(/_RL_/g,"")+"&th=.5&lang=EN&annType=ALL&match=PARTIAL_MATCHING&MCS=ON&dense=true&cands=TOP&extAIDA=true&key=%3Cyour_key%3E"
  console.log(babel_url)
  $.ajax({
      async:false,
      url: babel_url,
      cache: true,
      success: function(data) {
        babel_result = data
      },
      error: function (data, status, error) {
        console.log('error', data, status, error);
      }
  });


  console.log(babel_result)


  var annotations = []
  var treshold = 0.1;
  for (var i = 0; i < tagme_result.annotations.length; i++) {
    if(tagme_result.annotations[i].link_probability > treshold){
      annotations.push({"abstract":tagme_result.annotations[i].abstract,"title":tagme_result.annotations[i].title,"spot":tagme_result.annotations[i].spot,"categories":tagme_result.annotations[i].dbpedia_categories,"link_probability":tagme_result.annotations[i].link_probability})
    }
  }


  $scope.annotations = annotations;

  $scope.description = topic_description[0]["description"].toString().replace(/_RL_/g,"")
  $scope.subtopic = subtopic.toUpperCase();
  $scope.topic = topic_description[0]["topic"];
  $scope.page = topic_description[0]["page"];

  // TODO : loop into topic description and underline the annotation key words $('.topic_description')
}]);
