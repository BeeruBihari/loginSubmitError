import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  Button,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { createStackNavigator, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from '../../src/Mainmenu';
import MainScreen from '../screens/Auth/MainScreen';
import Data from '../screens/Auth/DataAdding';

class AuthLoadingScreen extends React.Component {
  static navigationOptions = {
    header:null,
  };
  constructor() {
    super();
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken_shop1');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(userToken ? 'App' : 'Auth');
    // this.props.navigation.navigate(userToken ? 'Auth' : 'Auth');

  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const AppStack = createStackNavigator({ 
  Home: {
    screen:MainTabNavigator,
    navigationOptions:{
      header:null,
    }
  },
});

const AddData = createStackNavigator({ 
  Data1: {
    screen:Data,
    navigationOptions:{
      header:null,
    }
  },
});

const AuthStack = createStackNavigator({ 
  SignIn:{
    screen:MainScreen,
    navigationOptions:{
      header:null,
    }
  },
});

export default createSwitchNavigator(
  {
    AuthLoading: {
      screen:AuthLoadingScreen,
      navigationOptions:{
        header:null,
      }
    },
    App: {
      screen:AppStack,
      navigationOptions:{
        title:"hehh"
      }
    },
    Auth: {
      screen:AuthStack,
      navigationOptions:{
        header:null,
      }
    },
    Data: {
      screen:AddData,
      navigationOptions:{
        header:null,
      }
    },

  },
  { 
    initialRouteName: 'AuthLoading',
    mode: 'modal',
    headerMode: 'none',
    navigationOptions: {
      header:null
    },
  }
);


// export default createSwitchNavigator({
//   // You could add another route here for authentication.
//   // Read more at https://reactnavigation.org/docs/en/auth-flow.html
//   Main: MainTabNavigator,
// });

// _showMoreApp = () => {
//   this.props.navigation.navigate('Other');
// };

// _signOutAsync = async () => {
//   await AsyncStorage.clear();
//   this.props.navigation.navigate('Auth');
// };

// _signInAsync = async () => {
//   await AsyncStorage.setItem('userToken', 'abc');
//   this.props.navigation.navigate('App');
// };