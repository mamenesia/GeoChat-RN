import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
  Button,
} from 'react-native';
import firebase from 'firebase';
import Geolocation from 'react-native-geolocation-service';
import styles from '../constant/styles';

export default class ProfileScreen extends Component {
  watchId = null;
  state = {
    errorMessage: null,
    loading: false,
    updatesEnabled: false,
    location: {},
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
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
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
          this.setState({location: position, loading: false});
          console.log(position);
        },
        error => {
          this.setState({location: error, loading: false});
          console.log(error);
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

  getLocationUpdates = async () => {
    const hasLocationPermission = await this.hasLocationPermission();

    if (!hasLocationPermission) {
      return;
    }

    this.setState({updatesEnabled: true}, () => {
      this.watchId = Geolocation.watchPosition(
        position => {
          this.setState({location: position});
          console.log(position);
        },
        error => {
          this.setState({location: error});
          console.log(error);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 0,
          interval: 5000,
          fastestInterval: 2000,
        },
      );
    });
  };

  removeLocationUpdates = () => {
    if (this.watchId !== null) {
      Geolocation.clearWatch(this.watchId);
      this.setState({updatesEnabled: false});
    }
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
    const {loading, location, updatesEnabled} = this.state;
    return (
      <View style={styles.container}>
        <Text>ProfileScreen</Text>
        <Button
          title="Get Location"
          onPress={this.getLocation}
          disabled={loading || updatesEnabled}
        />
        <View style={styles.buttons}>
          <Button
            title="Start Observing"
            onPress={this.getLocationUpdates}
            disabled={updatesEnabled}
          />
          <Button
            title="Stop Observing"
            onPress={this.removeLocationUpdates}
            disabled={!updatesEnabled}
          />
        </View>

        <View style={styles.result}>
          <Text>{JSON.stringify(location, null, 4)}</Text>
        </View>
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
