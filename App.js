import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Type, Application } from './components/Camera';
import Orientation from './components/Arm';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Type" component={Type} options={{ headerShown: false, title: 'Type' }} />
        <Stack.Screen name="Orientation" component={Orientation} options={{ headerShown: false }} />
        <Stack.Screen name="Camera" component={Application} options={{ headerShown: false }} />
      </Stack.Navigator>
      <StatusBar />
    </NavigationContainer>
  );
}
