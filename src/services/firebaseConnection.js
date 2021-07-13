import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";

let firebaseConfig = {
  apiKey: "AIzaSyCSClM1-_bMq3KVjs0iBkIdTAIMsj-8koU",
  authDomain: "mani-2a17c.firebaseapp.com",
  projectId: "mani-2a17c",
  storageBucket: "mani-2a17c.appspot.com",
  messagingSenderId: "793382790566",
  appId: "1:793382790566:web:bcd65a06d5569249701b67",
  measurementId: "G-EEXJMX8YKS",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
