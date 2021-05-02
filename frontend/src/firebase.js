import firebase from "firebase/app"
import 'firebase/auth';

const firebaseConfig = {
  apiKey:"AIzaSyAnDafQAaUOQupTAOXlVaNG8LWANKRnkYg",
  authDomain:"carouseltest-aea9b.firebaseapp.com",
  projectId:"carouseltest-aea9b",
  storageBucket:"carouseltest-aea9b.appspot.com",
  messagingSenderId:"246333684038",
  appId:"1:246333684038:web:08bf8012a35ea871368d47",
  measurementId:"G-L68RQS8PL0"
};

firebase.initializeApp(firebaseConfig);

export default {
    auth: firebase.auth(),
    login() {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider)
      .then(function(result) {
        console.log(result);
      })
      .catch(function(error){
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = error.credential;
        console.log(errorCode, errorMessage, email, credential);
        })
    },
    logout() {
      firebase.auth().signOut()
      .then(function() {})
      .catch(function(error) {
        console.log(error)});
    }
}
