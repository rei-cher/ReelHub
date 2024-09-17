import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeStackNavigator from './HomeStackNavigator';
import SearchScreen from '../screens/SearchScreen';
import SavedScreen from '../screens/SavedScreen';
import DoneScreen from '../screens/DoneScreen';
import ProgressScreen from '../screens/ProgressScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Icon from 'react-native-vector-icons/Ionicons';

import colors from "../styles/theme";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;

        switch (route.name) {
          case 'Home':
            iconName = 'home-outline';
            break;
          case 'Search':
            iconName = 'search-outline';
            break;
          case 'Saved':
            iconName = 'bookmark-outline';
            break;
          case 'Done':
            iconName = 'checkmark-done-outline';
            break;
          case 'Progress':
            iconName = 'time-outline';
            break;
          case 'Profile':
            iconName = 'person-outline';
            break;
          default:
            iconName = 'ellipse-outline';
            break;
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      headerShown: false,
      tabBarStyle: {
        backgroundColor: colors.cardBackground,
        borderTopColor: colors.cardBackground,
      },
      tabBarActiveTintColor: colors.accent,
      tabBarInactiveTintColor: colors.secondaryText
    })}
  >
    <Tab.Screen name="Home" component={HomeStackNavigator} />
    <Tab.Screen name="Search" component={SearchScreen} />
    <Tab.Screen name="Saved" component={SavedScreen} />
    <Tab.Screen name="Done" component={DoneScreen} />
    <Tab.Screen name="Progress" component={ProgressScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export default BottomTabNavigator;