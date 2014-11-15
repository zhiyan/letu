var URL = "http://www.letubang.com/",
    API = URL + "api/";

angular.module('letu', ['ionic', 'letu.controllers', 'letu.services','ngCordova'])

.run(function($ionicPlatform,$ionicPopup,$rootScope) {
  setTimeout(function() {
    navigator.splashscreen.hide();
  }, 2000);
  $ionicPlatform.registerBackButtonAction(function(e) {
    e.preventDefault();

    function showConfirm() {
      var confirmPopup = $ionicPopup.confirm({
        title: '<strong>退出?</strong>',
        template: '确认要退出应用吗?',
        cancelText:'取消',
        okText:'确认'
      });

      confirmPopup.then(function(res) {
        if (res) {
          ionic.Platform.exitApp();
        } else {

        }
      });
    }
    // alert(JSON.stringify($rootScope.$viewHistory))
    // Is there a page to go back to?
    if ($rootScope.$viewHistory.backView && $rootScope.$viewHistory.currentView.stateId !== "tab.dash") {
      // Go back in history
      $rootScope.$viewHistory.backView.go();
    } else {
      // This is the last page: Show confirmation popup
      showConfirm();
    }

    return false;
  }, 101);
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      // StatusBar.styleDefault();
      StatusBar.hide();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })

    // Each tab has its own nav history stack:

    .state('tab.dash', {
      url: '/dash',
      views: {
        'dash': {
          templateUrl: 'templates/dash.html',
          controller: 'DashCtrl'
        }
      }
    })

    .state('tab.events', {
      url: '/events/:city/:charge_type/:category/:filter_time',
      views: {
        'events': {
          templateUrl: 'templates/events.html',
          controller: 'EventsCtrl'
        }
      }
    })

    .state('tab.account', {
      url: '/account',
      views: {
        'account': {
          templateUrl: 'templates/account.html',
          controller: 'AccountCtrl'
        }
      }
    })

    .state('tab.signin', {
      url: '/signin',
      views: {
        'account': {
          templateUrl: 'templates/signin.html',
          controller: 'SigninCtrl'
        }
      }
    })

    .state('tab.register', {
      url: '/register',
      views: {
        'account': {
          templateUrl: 'templates/register.html',
          controller: 'RegisterCtrl'
        }
      }
    })

    .state('tab.detail', {
      url: '/event/:eventId',
      views: {
        'events': {
          templateUrl: 'templates/detail.html',
          controller: 'EventDetailCtrl'
        }
      }
    })

    .state('checkout', {
      url: '/checkout',
      templateUrl: 'templates/checkout.html',
      controller: 'CheckoutCtrl'
    })

    .state('success', {
      url: '/success',
      templateUrl: 'templates/success.html',
      controller: 'SuccessCtrl'
    })

    .state('apply', {
      url: '/apply/:eventId',
      templateUrl: 'templates/apply.html',
      controller: 'ApplyCtrl'
    })

    .state('publish_events', {
      url: '/publish_events',
      templateUrl: 'templates/events_publish.html',
      controller: 'PublishEventsCtrl'
    })

    .state('apply_events', {
      url: '/apply_events',
      templateUrl: 'templates/events.html',
      controller: 'ApplyEventsCtrl'
    })

    .state('list_people', {
      url: '/list_people/:eventId',
      templateUrl: 'templates/list_people.html',
      controller: 'ListPeopleCtrl'
    })

  $urlRouterProvider.otherwise('/tab/dash');

});
