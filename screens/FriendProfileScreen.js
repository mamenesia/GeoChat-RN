import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ToastAndroid,
  AsyncStorage,
  Button,
} from 'react-native';
import firebase from 'firebase';
// import styles from '../constant/styles';
import {Database, Auth} from '../constant/config';

export default class ProfileScreen extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.getParam('item').name + "'s Profile",
    };
  };
  state = {
    person: this.props.navigation.getParam('item'),
  };

  componentDidMount = async () => {
    const userId = await AsyncStorage.getItem('userid');
    const userName = await AsyncStorage.getItem('user.name');
    const userAvatar = await AsyncStorage.getItem('user.photo');
    const userEmail = await AsyncStorage.getItem('user.email');
    this.setState({userId, userName, userAvatar, userEmail});
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={{alignItems: 'center', marginHorizontal: 30}}>
            <Image
              style={styles.avatarImg}
              source={{
                uri: this.state.person.photo,
              }}
            />
            <Text style={styles.name}>{this.state.person.name}</Text>
            <Text style={styles.email}>{this.state.person.status}</Text>
            <Text style={styles.email}>{this.state.person.email}</Text>
            <Text style={styles.description}>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
              commodo ligula eget dolor. Aenean massa. Cum sociis natoque
              penatibus et magnis dis parturient montes, nascetur ridiculus mus.
              Donec quam felis, ultricies nec
            </Text>
          </View>
          <View style={styles.separator}></View>
          <View style={styles.logoutContainer}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={() =>
                this.props.navigation.navigate('Chat', {
                  item: this.state.person,
                })
              }>
              <Text style={styles.logoutButtonText}>
                Chat with {this.state.person.name}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  avatarImg: {
    width: 200,
    height: 200,
  },
  name: {
    fontSize: 28,
    color: '#696969',
    fontWeight: 'bold',
  },
  email: {
    marginTop: 10,
    fontSize: 18,
    color: 'green',
    fontWeight: 'bold',
  },
  description: {
    textAlign: 'center',
    marginTop: 10,
    color: '#696969',
  },
  separator: {
    height: 2,
    backgroundColor: '#eeeeee',
    marginTop: 20,
    marginHorizontal: 30,
  },
  logoutButton: {
    marginTop: 10,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: '#00BFFF',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  logoutContainer: {
    marginHorizontal: 30,
  },
});
