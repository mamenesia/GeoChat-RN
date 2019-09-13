import React, {Component} from 'react';
import {
  View,
  StatusBar,
  FlatList,
  ActivityIndicator,
  Alert,
  Text,
  AsyncStorage,
  StyleSheet,
  Image,
} from 'react-native';
import {
  Container,
  Content,
  Body,
  ListItem,
  Left,
  Thumbnail,
  Header,
  Title,
} from 'native-base';
import {Database, Auth} from '../constant/config';

export default class FriendListScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    userList: [],
    refreshing: false,
    uid: null,
  };
  componentDidMount = async () => {
    const uid = await AsyncStorage.getItem('userid');
    this.setState({uid, refreshing: true});
    Database.ref('/user').on('child_added', data => {
      // console.warn(data);
      let person = data.val();
      person.id = data.key;
      if (person.id != this.state.uid) {
        this.setState(prevData => {
          return {userList: [...prevData.userList, person]};
        });
        this.setState({refreshing: false});
      }
    });
  };

  _renderItem = ({item}) => {
    console.warn(item);
    <ListItem
      avatar
      onPress={() =>
        this.props.navigation.navigate('Chat', {
          id: item.id,
          photo: item.photo,
          name: item.name,
          status: item.status,
          lattitude: item.lattitude,
          longitude: item.longitude,
        })
      }>
      <Left>
        <Thumbnail source={{uri: item.photo}} />
      </Left>
      <Body style={{marginLeft: 7}}>
        <Text numberOfLines={1} style={{fontWeight: 'bold'}}>
          {item.name}
        </Text>
        <Text note numberOfLines={1}>
          {item.status}
        </Text>
      </Body>
    </ListItem>;
  };
  render() {
    return (
      <Container>
        <Header style={{backgroundColor: 'black'}}>
          <Body>
            <Title style={{left: 20}}>GeoChat</Title>
          </Body>
        </Header>
        <Content>
          <StatusBar backgroundColor="black" barStyle="light-content" />
          {this.state.refreshing == true ? (
            <ActivityIndicator
              size="large"
              color="#ccc"
              style={{marginTop: 100}}
            />
          ) : (
            <View style={{flex: 1}}>
              <FlatList
                data={this.state.userList}
                renderItem={this._renderItem}
                keyExtractor={item => item.id}
              />
            </View>
          )}
        </Content>
      </Container>
    );
  }
}
