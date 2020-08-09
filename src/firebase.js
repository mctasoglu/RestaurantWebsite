import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyAs-qDo22pWtsDGmIir-nmZCE2ku-DdyIY",
  authDomain: "react-test-69876.firebaseapp.com",
  databaseURL: "https://react-test-69876.firebaseio.com",
  projectId: "react-test-69876",
  storageBucket: "react-test-69876.appspot.com",
  messagingSenderId: "902301367963",
  appId: "1:902301367963:web:b73f53fcb5a3899ab3103e",
  measurementId: "G-RY50KJ2WJW",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const storage = firebase.storage();

export { storage, firebase as default };
