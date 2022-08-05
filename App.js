import React from 'react';
import Main from './components/Camera';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <Main>
      <StatusBar hidden />
    </Main>
  )
}
