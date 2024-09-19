import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from '../screens/MainScreen';
import CategoryScreen from '../screens/CategoryScreen';

const Stack = createStackNavigator();

const HomeStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Category" component={CategoryScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

export default HomeStackNavigator;