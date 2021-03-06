
angular.module('lmsApp')

.factory('LoggedInUser', ['$location', function($location) {

  var userLoggedin;
  var id = "";

   firebase.auth().onAuthStateChanged(function(user) {
    if (user) {

      //CHECK AUTH
      id = user.uid;

      //CHECK DATABASE
      firebase.database().ref('/users/' + id).on("value", function(snapshot) {
        setUserLoggedin(snapshot.val().utype);
      })
    }
    else {
      setUserLoggedin("noUser");
      $location.path('/');
    }
  });

  function setUserLoggedin(user_type) {
    userLoggedin = user_type;
  }



  function getUsertype() {
    return userLoggedin;
  }

  function getUID() {
    return id;
  }


  return {
    getUsertype: getUsertype,
    getUID: getUID
  };
}])

.service('pageAuth', ['$location', '$rootScope', 'LoggedInUser', function ($location, $rootScope, LoggedInUser) {

  var canAccess = function(event, next, prev, error)
  {
    if (error === "AUTH_REQUIRED"){
      event.preventDefault();
      alert("You must be logged in to access page!");
      var user = firebase.auth().currentUser;
      if (prev.$$route && user)
      {
        $location.path(prev.$$route.originalPath);
      }
      else{
        $location.path('/');
      }
    }
  }

  var checkUser = function (event, next, prev, err) {

    var user = firebase.auth().currentUser;
    if ( $location.path() === "/" && user !== null
      || $location.path() === "/home" && user !== null) {

        if (prev.$$route !== 'undefined') {
          $location.path(prev.$$route.originalPath);

        }
        else {
          event.preventDefault();
        }
    }

    var utype = LoggedInUser.getUsertype();
    if (utype !== "noUser") {
      switch (utype) {
        case "teacher":
          checkIfAllowed(utype);
          break;
        case "student":
          checkIfAllowed(utype);
          break;
        case "admin":
          checkIfAllowed(utype);
          break;
        default:
          break;

      }

    }

    function checkIfAllowed(type) {
      var nextRouteAuth = next.data.requireAuth;

      if (nextRouteAuth !== "none") {


        if (Array.isArray(nextRouteAuth)) {

          var allowed = nextRouteAuth.some(function(user) {

              if (user === type)
                return true;
              else return false;
          });

          if (allowed !== true) {
            event.preventDefault();
            alert("You are not authorized to access the page!");
          }

        }
        else {

          if (type !== nextRouteAuth) {
            event.preventDefault();
            alert("You are not authorized to access the page!");
          }


        } //end else
      }
    }//end checkIfAllowed


  }

  $rootScope.$on('$routeChangeError',canAccess);
  $rootScope.$on('$routeChangeStart',checkUser);
}]);


angular.module('lmsApp')
  .run(function runApp(pageAuth){
  });
