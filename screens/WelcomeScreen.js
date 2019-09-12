import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import styles from '../constant/styles';

export default class WelcomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  handleLogin = () => {
    this.props.navigation.navigate('Login');
  };
  handleRegister = () => {
    this.props.navigation.navigate('Register');
  };
  render() {
    return (
      <View style={[styles.container, {backgroundColor: '#fff'}]}>
        <View>
          <Text style={styles.title}>Welcome to GeoChat</Text>
          <Text style={styles.description}>
            Chatting while stalking your friends
          </Text>
        </View>
        <Image source={require('../chat.gif')} style={styles.icon} />
        <View style={styles.options}>
          <TouchableOpacity
            style={[styles.buttonContainer, styles.authButton]}
            onPress={this.handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonContainer, styles.authButton]}
            onPress={this.handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
