// import React, { useEffect } from 'react';
// import { Alert } from 'react-native';
// import messaging from '@react-native-firebase/messaging';
import React from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.appTitle}>Hello Todolist</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3143e8',
  },
  appTitle: {
    color: '#fff',
    fontSize: 36,
    marginTop: 30,
    marginBottom: 30,
    fontWeight: '300',
    textAlign: 'center',
    backgroundColor: '#3143e8',
  },
});

// function App() {
//   useEffect(() => {
//     const unsubscribe = messaging().onMessage(async remoteMessage => {
//       Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
//     });

//     return unsubscribe;
//   }, []);
// }
export default App;
