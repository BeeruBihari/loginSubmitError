import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={'home-outline'}
    />
  ),
};


// const SettingsStack = createStackNavigator({
//   Settings: Settings,
// });

// SettingsStack.navigationOptions = {
  
//   tabBarIcon: ({ focused }) => (
//     <TabBarIcon
//       focused={focused}
//       name={'account-box-outline'}
//     />
//   ),
// };

export default createBottomTabNavigator(
  {
   
    HomeStack
  },
  {
    tabBarOptions:{
      showLabel: false,
    }, 
  }
);
