angular.module('myApp', [
  'ngRoute',
  'ngResource',
  'ngAnimate',
  'ui.bootstrap',
  'LocalStorageModule',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers'
])
  .constant('config', window.angularConfig)
  .config([
    '$httpProvider',
    'config',
    function ($httpProvider, config) {
      $httpProvider.defaults.headers.common['X-CSRF-Token'] = config.csrf;
    }
  ])
  .config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {

      // html5mode
      $locationProvider.html5Mode(true);
      $locationProvider.hashPrefix('!');

      $routeProvider.when('/', {
        templateUrl: '/views/home.html',
        controller: 'HomeCtrl'
      })
      .when('/add', {
        templateUrl: '/views/add-update.html',
        controller: 'AddCtrl'
      })
      .when('/archived', {
        templateUrl: '/views/archived.html',
        controller: 'ArchivedCtrl'
      })
      .when('/sprint/:id', {
        templateUrl: '/views/sprint.html',
        controller: 'SprintCtrl'
      })
      .when('/sprint/:id/edit', {
        templateUrl: '/views/add-update.html',
        controller: 'UpdateCtrl'
      })
      .when('/sprint/:id/:milestone', {
        templateUrl: '/views/sprint.html',
        controller: 'SubSprintCtrl'
      })
      .when('/error', {
        templateUrl: '/views/404.html',
      })
      .otherwise({
        redirectTo : '/error'
      });
            
    }
  ])
  .run([
    '$rootScope',
    '$http',
    '$location',
    'sprintService',
    'config',
    function ($rootScope, $http, $location, sprintService, config) {
      // Jump to top of viewport when new views load
      $rootScope.$on('$locationChangeSuccess', function(event) {
        window.scrollTo(0, 0);

        // Redirect old URLs
        var hash = $location.hash();
        var isSprint = hash && hash.match(/\/sprint\/(\d+)/);
        if (isSprint) {
          $location.hash('');
          $location.path('/sprint/' + isSprint[1]);
        }

      });

      $rootScope.canEdit = function canEdit(user) {
        if (!user) {
          return false;
        }
        return config.admins.indexOf(user.login.toLowerCase()) > -1;
      };

    }
  ]);
