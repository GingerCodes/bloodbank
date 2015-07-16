var app=angular.module("bloodbankapp",['ngRoute','ngResource','ui.bootstrap', 'lbServices']);

app
 .config(function($routeProvider, $locationProvider){
  $routeProvider
   .when('/', {
    controller: 'homepagectrl',
    templateUrl: 'views/home.html'
   });

  $locationProvider.html5Mode(true);
 });