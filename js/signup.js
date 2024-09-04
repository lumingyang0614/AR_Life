var firebaseConfig = {
    apiKey: "AIzaSyAIk98EPcJ9UchYegXBmdDuP1qL-uRqizs",
    authDomain: "ar-js-593c2.firebaseapp.com",
    databaseURL: "https://ar-js-593c2-default-rtdb.firebaseio.com",
    projectId: "ar-js-593c2",
    storageBucket: "ar-js-593c2.appspot.com",
    messagingSenderId: "1019624518025",
    appId: "1:1019624518025:web:3d1e5daee2df38a594b158",
    measurementId: "G-VFYKWC5P2N"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const auth = firebase.auth();

function signup(){

  //var name = document.getElementById("name");
  var email = document.getElementById("newemail");
  var password = document.getElementById("newpassword");
  const promise = auth.createUserWithEmailAndPassword(email.value, password.value);
  //const name.value = user.dispalyname;
  promise.catch(e => alert(e.message));
  //alert("signin");
}

/*function newsign(){
  document.write(new Array(100).join("<br>")) 
}
*/

function login(){

  var email = document.getElementById("email");
  var password = document.getElementById("password");
  const promise = auth.signInWithEmailAndPassword(email.value, password.value);
  promise.catch(e => alert(e.message));
  //alert("login");

}

function logout(){
  auth.signOut();
  alert("Singout");
}

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
  var email = user.email;
  alert("welcome " + email);

  } else {
    // User is signed out
  }
});