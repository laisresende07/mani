import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

let firebaseConfig = {
  apiKey: "AIzaSyC-ps6hXT2Lrx0ovigYV7uEfcJQE40DJLs",
  authDomain: "mani-fab2d.firebaseapp.com",
  projectId: "mani-fab2d",
  storageBucket: "mani-fab2d.appspot.com",
  messagingSenderId: "280056772360",
  appId: "1:280056772360:web:a5c2679ca742fe11645ebd",
  measurementId: "G-3GT8M4J142"
};

if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
