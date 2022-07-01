import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Type from './components/CameraType'
import Orientation from './components/CameraOrientation';
import CameraApp from './components/CameraApp';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Camera" component={CameraApp} options={{ headerShown: false }} />
        <Stack.Screen name="Type" component={Type} options={{ title: 'Camera Type' }} />
        <Stack.Screen name="Orientation" component={Orientation} options={{ title: 'Camera Orientation' }} />
        {/* <Stack.Screen name="Camera" component={Camera} options={{ headerShown: false }} /> */}
      </Stack.Navigator>
      <StatusBar />
    </NavigationContainer>
  );
}