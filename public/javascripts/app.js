var app = angular.module('LogAnalysisWebApp',['ngRoute']);

// Configure the route
app.config(['$routeProvider',function($routeProvider){
  $routeProvider
  .when("/about",
      {templateUrl : "../views/about.html",
      controller : "aboutController"})

  .otherwise("/404",
      {templateUrl : "../views/404.html",
      controller : "errorController"})
}])
