import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Orientation, Cam } from './components/Camera';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Orientation" component={Orientation} options={{ headerShown: false }} />
        <Stack.Screen name="Camera" component={Cam} options={{ headerShown: false }} />
      </Stack.Navigator>
      <StatusBar hidden />
    </NavigationContainer>
  );
}
