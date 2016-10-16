angular.module('lmsApp')
  .controller('classRecordCtrl', ['$scope', '$location', 'Users', '$firebaseArray', '$routeParams', 'Class',function($scope, $location, Users, $firebaseArray, $routeParams, Class){

    $scope.classID = $routeParams.id;
    
    var ref = firebase.database().ref('/users');
    var users = $firebaseArray(ref).$loaded().then(function(c) {
      $scope.users = c;
    }).catch(function(err) {
      return err;
    });

    $scope.add = function(val) {
      ref.on('child_added', function(snap) {
          if (snap.val().email === val) {
            getid(snap.key, snap.val());

          }
      });
    }

    function getid(id, info) {

      var parent = Class.getClass();
      var parent_class = parent[$routeParams.id];
      var classList = $firebaseArray(ref.child(id).child('classes'));

      classList.$add({
        subject: parent_class.$id,
        subject_name: parent_class.Subject,
      });
      console.log(info);

      Class.addStudent(id, {
        fname: info.firstname,
        lname: info.lastname,
        email: info .email,
        s_id: info.uid
      })

    }

    $scope.students = Class.getAllStudents()
}])
