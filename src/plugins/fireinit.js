import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'
import 'firebase/storage'
import * as geofirex from 'geofirex';

var config = {
    apiKey: "AIzaSyBugxrEreELjfqQdq4om2ZqJdaecfqWyxA",
    authDomain: "stonary8.firebaseapp.com",
    databaseURL: "https://stonary8.firebaseio.com",
    projectId: "stonary8",
    storageBucket: "stonary8.appspot.com",
    messagingSenderId: "616887681735",
    appId: "1:616887681735:web:667c9ca304f5e42cfc74e2"
}

!firebase.apps.length ? firebase.initializeApp(config) : ''
export const GoogleProvider = new firebase.auth.GoogleAuthProvider()
export const FbProvider = new firebase.auth.FacebookAuthProvider()
export const auth = firebase.auth()
export const db = firebase.firestore()
export const storage = firebase.storage()
export const functions = firebase.functions()
export const geo = geofirex.init(firebase)
export default firebase