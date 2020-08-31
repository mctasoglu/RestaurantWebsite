import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyB9NVIkZtEI-Iow8I_xtJdYymzPzotkeA8",
  authDomain: "chutoro-6bc1a.firebaseapp.com",
  databaseURL: "https://chutoro-6bc1a.firebaseio.com",
  projectId: "chutoro-6bc1a",
  storageBucket: "chutoro-6bc1a.appspot.com",
  messagingSenderId: "219545154208",
  appId: "1:219545154208:web:8ab27203302fef32420fc5",
  measurementId: "G-NPZX19YZPN",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const storage = firebase.storage();

export { storage, firebase as default };
