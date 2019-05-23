import firebase from 'firebase';
import 'firebase/firestore';
import config from '../config/firebase';

firebase.initializeApp(config);

// firebase utils
const db = firebase.firestore();
const auth = firebase.auth();

// date issue fix according to firebase
const settings = {
  timestampsInSnapshots: true,
};
db.settings(settings);

// firebase collections
const usersCollection = db.collection('users');

export {
  db,
  auth,
  usersCollection,
};
