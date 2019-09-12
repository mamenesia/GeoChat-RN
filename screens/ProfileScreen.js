import React, {Component} from 'react';
import {View, Text, Alert, TouchableOpacity} from 'react-native';
import firebase from 'firebase';
import styles from '../constant/styles';

export default class ProfileScreen extends Component {
  state = {
    errorMessage: null,
  };
  handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => this.props.navigation.navigate('Welcome'))
      .catch(error => this.setState({errorMessage: error.message}));
    // Alert.alert('Error Message', this.state.errorMessage);
  };
  render() {
    return (
      <View style={styles.container}>
        <Text>ProfileScreen</Text>
        <TouchableOpacity onPress={() => this.props.navigation.replace('Home')}>
          <Text>Auth</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.handleLogout}>
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
