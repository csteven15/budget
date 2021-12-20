import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/analytics'
// Configure Firebase.
const config = {
  apiKey: 'AIzaSyCAobrZFplFb0MU-yFa9f8t-5u3brsgYNA',
  authDomain: 'budget-b7102.firebaseapp.com',
  projectId: 'budget-b7102',
  storageBucket: 'budget-b7102.appspot.com',
  messagingSenderId: '420766432568',
  appId: '1:420766432568:web:6c818df0d9dc00c74f55cd',
  measurementId: 'G-Q2Y510ZMMG',
}
firebase.initializeApp(config)

const fire = firebase

export default fire
