
  angular.module('lmsApp')

    .controller('loginCtrl', ['$scope', '$firebaseAuth', '$firebaseArray','$location', function($scope, $firebaseAuth, $firebaseArray, $location){


      $scope.authObj = $firebaseAuth();
      var ref = firebase.database().ref("/users");
      var userInfo = $firebaseArray(ref);

      //facebook
      $scope.LoginFacebook = popup("facebook");

      $scope.LoginGoogle = popup("google");

      $scope.LoginEmail = function(info) {

        $scope.authObj.$signInWithEmailAndPassword(info.email, info.password)
        .then(function(result) {
            getUtype(result.user.uid);
        }).catch(function(error) {
          console.log(error);
        });

      }


      var popup = function(provider) {
        $scope.authObj.$signInWithPopup(provider).then(function(result) {
          getUtype(result.user.uid);
        });
      }

      var getUtype = function(id) {


        ref.child(id).on('value', function(snapshot) {


          var user = firebase.auth().currentUser;
          if (snapshot.val() !== null) {
            ref.child(id).on('value', function(snapshot) {
              var type = snapshot.val().utype;

              switch (type) {
                case "student":
                  $location.path('/profile');
                  break;
                case "teacher":
                  $location.path('/profile');
                  break;
                case "admin":
                  $location.path('/admin');
                  break;
                default:
                  $location.path('/profile_info/' + user.uid   );
                  // FIXME: where to redirect if no info
              }

            })
          }
          else {
            $location.path('/profile_info/' + user.uid   );

          }


        })

      }

    }]);
