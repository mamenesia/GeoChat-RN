import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import firebase from 'firebase';
import styles from '../constant/styles';

export default class RegisterScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    email: '',
    password: '',
  };
  handleChange = key => val => {
    this.setState({[key]: val});
  };
  submitForm = () => {
    const {email, password} = this.state;
    if (email.length < 6) {
      Alert.alert('Error', 'Please input a valid email address');
    } else if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => this.props.navigation.navigate('Welcome'))
        .catch(error => this.setState({errorMessage: error.message}));
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
