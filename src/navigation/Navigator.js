import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();
import { NavigationContainer } from '@react-navigation/native';

import Home from '../pages/Home';
import Profile from '../pages/Profile';

const HomeIcon = require('../../assets/icon/icon-home-page.png');
const ProfileIcon = require('../../assets/icon/icon-profile-page.png');

const Navigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let icon;
            if (route.name === 'Home') {
              icon = (
                <Image
                  source={HomeIcon}
                  style={{ width: size, height: size, tintColor: color }}
                />
              );
            } else if (route.name === 'Profile') {
              icon = (
                <Image
                  source={ProfileIcon}
                  style={{ width: size, height: size, tintColor: color }}
                />
              );
            }
            return icon;
          },
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'gray',
          headerShown: false
        })}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
export default Navigator;
