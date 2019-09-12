import firebase from 'firebase';

var firebaseConfig = {
  apiKey: 'AIzaSyCepvPNPIurU2gzXF0Pt5IA2sf3YXhdIu4',
  authDomain: 'geochat-252415.firebaseapp.com',
  databaseURL: 'https://geochat-252415.firebaseio.com',
  projectId: 'geochat-252415',
  storageBucket: 'geochat-252415.appspot.com',
  messagingSenderId: '408297810709',
  appId: '1:408297810709:web:f7460ce49018d35a54971c',
};

let app = firebase.initializeApp(firebaseConfig);

export const Database = app.database();
export const Auth = app.auth();
