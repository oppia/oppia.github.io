// Copyright 2015 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var oppiaGithubPages = angular.module('oppiaGithubPages', ['ngRoute']);

oppiaGithubPages.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'pages/home.html',
      projectTag: 'User Documentation'
    })
    .when('/Screenshots', {
      templateUrl: 'pages/Screenshots.html',
      projectTag: 'Screenshots'
    })
    .when('/WhatIsOppia', {
      templateUrl: 'pages/WhatIsOppia.html',
      projectTag: 'What is Oppia?'
    })
    .when('/KeyConceptsInOppia', {
      templateUrl: 'pages/KeyConceptsInOppia.html',
      projectTag: 'Key concepts in Oppia'
    })
    .when('/TheExplorationGallery', {
      templateUrl: 'pages/TheExplorationGallery.html',
      projectTag: 'The Exploration Gallery'
    })
    .when('/TheLearnerView', {
      templateUrl: 'pages/TheLearnerView.html',
      projectTag: 'The Learner View'
    })
    .when('/CreatingAnExploration', {
      templateUrl: 'pages/CreatingAnExploration.html',
      projectTag: 'Creating an Exploration'
    })
    .when('/PlanningAnExploration', {
      templateUrl: 'pages/PlanningAnExploration.html',
      projectTag: 'Planning an Exploration'
    })
    .when('/TheExplorationEditor', {
      templateUrl: 'pages/TheExplorationEditor.html',
      projectTag: 'The Exploration Editor'
    })
    .when('/AWorkedExample', {
      templateUrl: 'pages/AWorkedExample.html',
      projectTag: 'A Worked Example'
    })
    .when('/PublishingAnExploration', {
      templateUrl: 'pages/PublishingAnExploration.html',
      projectTag: 'Publishing an Exploration'
    })
    .when('/ImprovingAnExploration', {
      templateUrl: 'pages/ImprovingAnExploration.html',
      projectTag: 'Improving an Exploration'
    })
    .when('/DownloadingAnExploration', {
      templateUrl: 'pages/DownloadingAnExploration.html',
      projectTag: 'Downloading an exploration'
    })
    .when('/Parameters', {
      templateUrl: 'pages/Parameters.html',
      projectTag: 'Parameters'
    })
    .when('/DesignTips', {
      templateUrl: 'pages/DesignTips.html',
      projectTag: 'Exploration Design Tips'
    })
    .when('/EmbeddingAnExploration', {
      templateUrl: 'pages/EmbeddingAnExploration.html',
      projectTag: 'Embedding an Exploration'
    })
    .otherwise({
      redirectTo: '/'
    });
     //Use the HTML5 History API to prettify URL (by removing #).
     $locationProvider.html5Mode(true);
}]);

oppiaGithubPages.run(['$location', '$rootScope', function($location, $rootScope) {
  $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
    $rootScope.projectTag = current.$$route.projectTag;
    $rootScope.title = 'Oppia: ' + current.$$route.projectTag;
  });
  $rootScope.isActive = function(route) {
    return route === $location.path();
  };
}]);
