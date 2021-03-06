import React, {Component} from 'react';
import {Image, View, StatusBar, ActivityIndicator} from 'react-native';
import firebase from 'firebase';
import styles from '../constant/styles';
import {Auth} from '../constant/config';

export default class AuthLoadingScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  componentDidMount = async () => {
    let firebaseConfig = {
      apiKey: 'AIzaSyCepvPNPIurU2gzXF0Pt5IA2sf3YXhdIu4',
      authDomain: 'geochat-252415.firebaseapp.com',
      databaseURL: 'https://geochat-252415.firebaseio.com',
      projectId: 'geochat-252415',
      storageBucket: 'geochat-252415.appspot.com',
      messagingSenderId: '408297810709',
      appId: '1:408297810709:web:f7460ce49018d35a54971c',
    };

    if (!firebase.apps.length) {
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
    }
    await Auth.onAuthStateChanged(user => {
      setInterval(
        () => this.props.navigation.navigate(user ? 'App' : 'Auth'),
        1000,
      );
    });
  };

  render() {
    return (
      <View style={[styles.container, {backgroundColor: '#fff'}]}>
        <StatusBar barStyle="default" />
        <Image source={require('../ChatList.gif')} style={styles.icon} />
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }
}
