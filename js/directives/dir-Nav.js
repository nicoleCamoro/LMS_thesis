angular.module('lmsApp')

.directive('dirNav', ['$location' , function($location) {


  var linker = function(scope) {
    scope.logOutUser = function() {
      firebase.auth().signOut();
      $location.path('/');
    }

    scope.location = function(href) {
      return href.substr(1) === $location.url();
    };

    scope.name = "";

    scope.NotifNum = 3;
    scope.MessageNum = 2;
  }




  return {
    restrict: 'A',
    // transclude: true,
    templateUrl: 'components/partials/navbar.html',
    link: linker
  };

}]);