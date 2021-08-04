import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

// firebase init
const firebaseConfig = {
  apiKey: "AIzaSyCD8EyoJBEvnZnV6zY5cHX8o15-X-MN0-4",
  authDomain: "code4real.firebaseapp.com",
  projectId: "code4real",
  storageBucket: "code4real.appspot.com",
  messagingSenderId: "921798240468",
  appId: "1:921798240468:web:7993fa2e8df0008a0a3341",
  measurementId: "G-4J49NF465C"
}
firebase.initializeApp(firebaseConfig)

// utils
const db = firebase.firestore()
const auth = firebase.auth()

// collection references
const usersCollection = db.collection('users')
const postsCollection = db.collection('posts')
const commentsCollection = db.collection('comments')
const likesCollection = db.collection('likes')

// export utils/refs
export {
  db,
  auth,
  usersCollection,
  postsCollection as postsCollection,
  commentsCollection,
  likesCollection
}

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
      .catch(function(error) {console.log(error)});
  }
}