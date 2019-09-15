import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  Platform,
  PermissionsAndroid,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  AsyncStorage,
} from 'react-native';
import firebase from 'firebase';
import Geolocation from 'react-native-geolocation-service';
import {Database, Auth} from '../constant/config';
import styles from '../constant/styles';

export default class LoginScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    email: '',
    password: '',
  };

  componentDidMount = async () => {
    await this.getLocation();
  };

  hasLocationPermission = async () => {
    if (
      Platform.OS === 'ios' ||
      (Platform.OS === 'android' && Platform.Version < 23)
    ) {
      return true;
    }
    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (hasPermission) {
      return true;
    }
    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }
    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location Permission Denied By User.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location Permission Revoked By User.',
        ToastAndroid.LONG,
      );
    }
    return false;
  };

  getLocation = async () => {
    const hasLocationPermission = await this.hasLocationPermission();

    if (!hasLocationPermission) {
      return;
    }

    this.setState({loading: true}, () => {
      Geolocation.getCurrentPosition(
        position => {
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            loading: false,
          });
          console.warn(position);
        },
        error => {
          this.setState({errorMessage: error});
          console.warn(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
          distanceFilter: 50,
          forceRequestLocation: true,
        },
      );
    });
  };

  handleChange = key => val => {
    this.setState({[key]: val});
  };
  submitForm = async () => {
    const {email, password} = this.state;
    if (email.length < 6) {
      ToastAndroid.show(
        'Please input a valid email address',
        ToastAndroid.LONG,
      );
    } else if (password.length < 6) {
      ToastAndroid.show(
        'Password must be at least 6 characters',
        ToastAndroid.LONG,
      );
    } else {
      Database.ref('/user')
        .orderByChild('email')
        .equalTo(email)
        .once('value', result => {
          let data = result.val();
          if (data !== null) {
            let user = Object.values(data);
            console.warn(user);
            AsyncStorage.setItem('user.email', user[0].email);
            AsyncStorage.setItem('user.name', user[0].name);
            AsyncStorage.setItem('user.photo', user[0].photo);
          }
        });
      Auth.signInWithEmailAndPassword(email, password)
        .then(async response => {
          console.warn(response);
          Database.ref('/user/' + response.user.uid).update({
            status: 'Online',
            latitude: this.state.latitude,
            longitude: this.state.longitude,
          });
          // AsyncStorage.setItem('user', response.user);
          await AsyncStorage.setItem('userid', response.user.uid);
          await AsyncStorage.setItem('user', response.user);
          ToastAndroid.show('Login success', ToastAndroid.LONG);
          setInterval(() => this.props.navigation.navigate('App'), 2000);
        })
        .catch(error => {
          console.warn(error);
          this.setState({
            errorMessage: error.message,
            email: '',
            password: '',
          });
          ToastAndroid.show(this.state.errorMessage, ToastAndroid.LONG);
        });
      // Alert.alert('Error Message', this.state.errorMessage);
    }
  };
  render() {
    return (
      <View style={[styles.container, {backgroundColor: '#5d4157'}]}>
        <Image
          source={require('../Icon.png')}
          style={[styles.icon, {marginBottom: -10}]}
        />
        <Text style={[styles.description, {color: '#fff'}]}>
          Please login if you already a member
        </Text>
        <TextInput
          placeholder="Email"
          value={this.state.email}
          onChangeText={this.handleChange('email')}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={this.state.password}
          onChangeText={this.handleChange('password')}
          style={styles.input}
        />
        <TouchableOpacity
          style={[styles.buttonContainer, styles.loginButton]}
          onPress={this.submitForm}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <View style={styles.center}>
          <Text style={styles.bottomText}>Don't have an account ? </Text>
          <Text
            style={styles.bottomTextLink}
            onPress={() => this.props.navigation.navigate('Register')}>
            Register
          </Text>
        </View>
      </View>
    );
  }
}
