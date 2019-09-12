import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import MapView from 'react-native-maps';
import styles from '../constant/styles';

export default class HomeScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={{width: '100%', height: 500}}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />

        <Text onPress={() => this.props.navigation.navigate('Chat')}>Chat</Text>
        <Text onPress={() => this.props.navigation.navigate('Profile')}>
          Profile
        </Text>
      </View>
    );
  }
}
