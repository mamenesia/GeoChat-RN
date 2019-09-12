import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Dimensions} from 'react-native';
import MapView from 'react-native-maps';
import styles from '../constant/styles';

const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class HomeScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  render() {
    return (
      <View style={[styles.container, {justifyContent: 'flex-start'}]}>
        <MapView
          style={{width: '100%', height: '80%'}}
          initialRegion={{
            latitude: -7.755322,
            longitude: 110.381174,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
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
