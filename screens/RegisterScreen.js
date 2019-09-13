import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native';
// import firebase from 'firebase';
import {Database, Auth} from '../constant/config';
import Geolocation from 'react-native-geolocation-service';
import styles from '../constant/styles';

export default class RegisterScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  watchId = null;
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      latitude: null,
      longitude: null,
      errorMessage: null,
      loading: false,
      updatesEnabled: false,
    };
  }

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
          this.setState({errorMessage: error, loading: false});
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

  submitForm = () => {
    const {email, name, password} = this.state;
    if (name.length < 1) {
      ToastAndroid.show('Please input your fullname', ToastAndroid.LONG);
    } else if (email.length < 6) {
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
      Auth.createUserWithEmailAndPassword(email, password)
        .then(response => {
          console.warn(response);
          Database.ref('/user/' + response.user.uid)
            .set({
              name: this.state.name,
              status: 'Offline',
              email: this.state.email,
              photo:
                'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/profle-512.png',
              latitude: this.state.latitude,
              longitude: this.state.longitude,
              id: response.user.uid,
            })
            .catch(error => {
              ToastAndroid.show(error.message, ToastAndroid.LONG);
              this.setState({
                name: '',
                email: '',
                password: '',
              });
            });
          ToastAndroid.show(
            'Your account is successfully registered!',
            ToastAndroid.LONG,
          );

          setInterval(() => this.props.navigation.navigate('Login'), 2000);
        })
        .catch(error => {
          this.setState({
            errorMessage: error.message,
            name: '',
            email: '',
            password: '',
          });
          ToastAndroid.show(this.state.errorMessage.message, ToastAndroid.LONG);
        });
      // Alert.alert('Error Message', this.state.errorMessage);
    }
  };
  render() {
    return (
      <View style={[styles.container, {backgroundColor: '#093637'}]}>
        <Image
          source={require('../Icon.png')}
          style={[styles.icon, {marginBottom: -10}]}
        />
        <Text style={[styles.description, {color: '#fff'}]}>
          Create your account now, it's free!
        </Text>
        <TextInput
          placeholder="Full Name"
          underlineColorAndroid="transparent"
          value={this.state.name}
          onChangeText={this.handleChange('name')}
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          underlineColorAndroid="transparent"
          value={this.state.email}
          onChangeText={this.handleChange('email')}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          underlineColorAndroid="transparent"
          secureTextEntry
          value={this.state.password}
          onChangeText={this.handleChange('password')}
          style={styles.input}
        />
        <TouchableOpacity
          style={[styles.buttonContainer, styles.registerButton]}
          onPress={this.submitForm}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <View style={styles.center}>
          <Text style={styles.bottomText}>Already have an account ? </Text>
          <Text
            style={styles.bottomTextLink}
            onPress={() => this.props.navigation.navigate('Login')}>
            Login
          </Text>
        </View>
      </View>
    );
  }
}
