import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Main } from './src/Main';


export default function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.flex1}>
        <StatusBar style='dark' />
        <Main />
      </GestureHandlerRootView >
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1,

  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
