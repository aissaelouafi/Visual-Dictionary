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

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function isUpperCase(str) {
    return str === str.toUpperCase();
}

function getTopicName(topic){
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


  var topic_dir = ""
  for (var i = 0; i < global_summary.length; i++) {
    if(topic.replace(/\s/g, '').toLowerCase() == global_summary[i].topic.replace(/\s/g, '').toLowerCase()){
      topic_dir = global_summary[i].topic;
    }
  }
  return topic_dir;
}

myApp.controller('indexController', ['$scope', function($scope) {
  console.log("index controller")
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

  console.log(global_summary)

  $scope.myFunc = function(element) {
      console.log(element.name);
      var search_results;
      $.ajax({
          async: false,
          type: 'GET',
          url: '/api/search_engine/'+element.name,
          dataType: 'json',
          success: function (data) {
            search_results = data;
          }
      });





      for (var i = 0; i < search_results.length; i++) {
        //search_results[i]["show_description"] = "... "+search_results[i].description.toString().split(element.name)[0].slice(-300)+search_results[i].description.toString().split(element.name)[1].substring(0,300) +"..."
        search_results[i]["subtopic"] =  search_results[i]["subtopic"].toUpperCase()
        search_results[i]["page"] =  search_results[i]["page"].toString().replace(/\s/g, '').toLowerCase()
        search_results[i]["image"] =  search_results[i]["image"].toString().replace(/\s/g, '').toLowerCase()
        var topic = search_results[i]["topic"].toString().replace(/\s/g, '').toLowerCase()
        console.log("topic : "+topic)
        console.log("folder : "+getTopicName(topic))
        search_results[i]["image"] = search_results[i]["image"].replace(topic,getTopicName(topic))
      }
      $scope.search_results = search_results;
      console.log(search_results)
      $('.description').mark('players')
  };
}]);

myApp.controller('topicController', ['$scope', function($scope) {
  console.log("Topic details controller ... ")
  var topic = QueryString.name
  var page = QueryString.page
  $scope.topic = topic.toUpperCase()


  var wiki_results =[];
  var element =""
  $.ajax({
      async: false,
      type: 'GET',
      url: 'https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles='+topic,
      dataType: 'json',
      success: function (data) {
        wiki_results = data;
        //console.log(data);
      }
  });
  for (var key in wiki_results.query.pages) {
    element = wiki_results.query.pages[key];
  }
  console.log(element)

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


  var topic_dir = ""
  for (var i = 0; i < global_summary.length; i++) {
    if(topic.replace(/\s/g, '').toLowerCase() == global_summary[i].topic.replace(/\s/g, '').toLowerCase()){
      topic_dir = global_summary[i].topic;
    }
  }
  console.log(topic_dir)

  topic = topic_dir.toLowerCase().replace(/\s/g, '')

  var topics_details;
  var subtopics = [];
  $.ajax({
    async:false,
    type:'GET',
    url:'/api/sub_topics/'+topic+'/'+topic_dir,
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


  var topic_image = "contents/images/croped_images/"+topic_dir+"/"+page+"_0.png"
  $scope.topic_image = topic_image
  $scope.topic_page = page
  console.log(topic_image)

}]);

myApp.controller('subtopicController',['$scope',function($scope){
  var token = "a33083f6-c493-4fc5-a1af-a3c111023fde-843339462"
  var tagme_url = "https://tagme.d4science.org/tagme/tag?lang=en&gcube-token="+token

  var subtopic = QueryString.subtopic.toLowerCase().replace(/\s/g, '');
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



  var annotations = []
  var treshold = 0.1;
  for (var i = 0; i < tagme_result.annotations.length; i++) {
    if(tagme_result.annotations[i].link_probability > treshold){
      annotations.push({"abstract":tagme_result.annotations[i].abstract,"title":tagme_result.annotations[i].title,"spot":tagme_result.annotations[i].spot,"categories":tagme_result.annotations[i].dbpedia_categories,"link_probability":tagme_result.annotations[i].link_probability})
    }
  }


  $scope.annotations = annotations;
  $scope.description = topic_description[0]["description"].toString().replace(/_RL_/g,"")
  $scope.subtopic = QueryString.subtopic.toUpperCase();
  $scope.topic = topic_description[0]["topic"].toUpperCase();
  $scope.page = topic_description[0]["page"];

  // TODO : loop into topic description and underline the annotation key words $('.topic_description')

  var subtopic_images = [];
  var unique = []
  var final_images = []
  $.ajax({
    async:false,
    type:'GET',
    url:'/api/subtopic_images/'+topic_description[0]["page"]+"/10",
    dataType:'json',
    success: function(data){
      subtopic_images = data;
    }
  });

  for (var i = 0; i < subtopic_images.length; i++) {
    unique.push(subtopic_images[i].image)
  }
  unique = unique.filter(onlyUnique)

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


  var topic_dir = ""
  for (var i = 0; i < global_summary.length; i++) {
    if(topic_description[0]["topic"].replace(/\s/g, '').toLowerCase() == global_summary[i].topic.replace(/\s/g, '').toLowerCase()){
      topic_dir = global_summary[i].topic;
    }
  }

  console.log(topic_dir)

  for (var i = 0; i < unique.length; i++) {
    final_images.push({"image":"/contents/images/croped_images/"+topic_dir+"/"+unique[i],"page":unique[i].split("_")[0],"id":unique[i].replace(".png",""),"topic":topic_dir,"subtopic":QueryString.subtopic})
  }

  console.log(final_images)
  $scope.nb_element = unique.length;
  $scope.unique = final_images;
  $scope.topic = topic_dir;


}]);


myApp.controller('elementController',['$scope',function($scope){
  console.log("element controller")
  $scope.element = {"id":QueryString.id,"page":QueryString.id.split("_")[0],"topic":QueryString.topic,"subtopic":QueryString.subtopic.toUpperCase(),"image_url":"contents/images/croped_images/"+QueryString.topic+"/"+QueryString.id+".png"}


  var image_legends;
  $.ajax({
      async: false,
      type: 'GET',
      url: '/api/subtopic_images/'+QueryString.id,
      dataType: 'json',
      success: function (data) {
        image_legends = data;
      }
  });

  var final_legend = []
  var fig_title = ""
  for (var i = 0; i < image_legends.length; i++) {
    if(image_legends[i].legend.length < 40){
      image_legends[i].legend = image_legends[i].legend.replace(/_RL_/g,"")
      image_legends[i].y = parseInt(image_legends[i].y)+200
      image_legends[i].x = parseInt(image_legends[i].x)+30
      if(isUpperCase(image_legends[i].legend)) {
        fig_title = image_legends[i].legend;
        image_legends[i].legend = ""
      }
      final_legend.push(image_legends[i])
    }
  }

  $scope.fig_title = fig_title;
  $scope.legends = final_legend;

  var legends_string = []
  for (var i = 0; i < final_legend.length; i++) {
    legends_string.push(final_legend[i].legend)
  }

  legends_string = legends_string.filter(onlyUnique)
  console.log(legends_string)

  var final_results = [];
  for (var i = 0; i < legends_string.length; i++) {
    var wiki_results =[];

    $.ajax({
        async: false,
        type: 'GET',
        url: 'https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles='+legends_string[i],
        dataType: 'json',
        success: function (data) {
          wiki_results = data;
          console.log(data);
        }
    });
    var element = "";
    try {
      for (var key in wiki_results.query.pages) {
        element = wiki_results.query.pages[key];
      }
      final_results.push({"legend":legends_string[i],"wikipedia_definition":element})
      throw "monException"; // génère une exception
  } catch(e){
    console.log(e)
  }
  }

  /*Image search*/
    var tab_images = [];
    var legends_images;

    for (var i = 0; i < legends_string.length; i++){


      var wiki_results =[];
      var legends_images = [];

      $.ajax({
          async: false,
          type: 'GET',
          cache: true,
          url: 'https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles='+legends_string[i],
          dataType: 'json',
          success: function (data) {
            wiki_results = data;
            //console.log(data);
          }
      });
      var element = "";
      try {
        $.ajax({
            async: false,
            type: 'GET',
            cache: true,
            url: 'https://www.googleapis.com/customsearch/v1?key=AIzaSyCTiujsR4ZbAR30ErqPTL4BQiJs6Y5nd-4&cx=003507009189361982086:5vyheu7uvka&q='+legends_string[i].replace(/\s/g,'+')+'&searchType=image&num=1&start=1&fileType=png&imgSize=large&alt=json',
            dataType: 'json',
            success: function (data) {
              legends_images = data;
            }
        });
        for (var key in wiki_results.query.pages) {
          element = wiki_results.query.pages[key];
        }
        var image;
        final_results.push({"image":legends_images.items[0].link,"legend":legends_string[i],"wikipedia_definition":element})
        throw "monException"; // génère une exception
    } catch(e){
      //console.log(e)
    }
  }


  for (var i = 0; i < final_results.length; i++) {
    console.log(final_results[i])
    if(final_results[i]["image"] == undefined) {final_results[i].image = "/contents/images/icons/noimage.jpeg"}
  }

  console.log(final_results)

  $scope.legends_string = final_results;
  $scope.nb_legends = legends_string.length;
}]);
