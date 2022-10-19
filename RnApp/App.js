import React, { useEffect, useCallback } from 'react';
// import { Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {WebView} from 'react-native-webview';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  Alert,
  BackHandler
} from 'react-native';
import MyWebView from './components/MyWebView';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const setFireBaseToken = async () => {
    const token = await messaging().getToken(); //토큰 나오는지 확인 로그로
    console.log('token', token);
  };

  useEffect(() => {
    setFireBaseToken();
  }, []);

  const foregroundListener = useCallback(() => {
    messaging().onMessage(async message => {
      console.log(message)
    })
  }, [])
      
  useEffect(() => {
    foregroundListener()  
  }, [])

  // return (
  //   <SafeAreaView style={styles.container}>
  //     <Text style={styles.appTitle}>Hello Todolist</Text>
  //   </SafeAreaView>
  // );
  return (
    <> 
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <SafeAreaView style={styles.root}>
        <MyWebView 
          // handleClose={()=>{
          //   Alert.alert('앱 종료', '앱을 종료하시겠습니까?', [
          //     {
          //       text: '아니오',
          //       onPress: () => null,
          //     },
          //     {text: '예', onPress: () => BackHandler.exitApp()},
          //   ]);
          // }}
          />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  // container: {
  //   flex: 1,
  //   backgroundColor: '#ffff',
  // },
  // appTitle: {
  //   color: '#fff',
  //   fontSize: 36,
  //   marginTop: 30,
  //   marginBottom: 30,
  //   fontWeight: '300',
  //   textAlign: 'center',
  //   backgroundColor: '#3143e8',
  // },
  // appContent: {
  //   color: '#fff',
  //   fontSize: 20,
  //   marginTop: 50,
  //   marginBottom: 50,
  //   fontWeight: '300',
  //   textAlign: 'center',
  //   backgroundColor: '#3143e8',
  // },
});

export default App;


// import React, { useState, useEffect, useCallback } from 'react';
// // import { Alert } from 'react-native';
// import messaging from '@react-native-firebase/messaging';
// import {Text, StyleSheet, View, Button} from 'react-native';
// import MyWebView from './components/MyWebView';
// import {localNotificationService} from './src/LocalNotificationService';

// export default function App() {
//   const isDarkMode = useColorScheme() === 'dark';

//   const setFireBaseToken = async () => {
//     const token = await messaging().getToken(); //토큰 나오는지 확인 로그로
//     console.log('token', token);
//   };

//   useEffect(() => {
//     setFireBaseToken();
//   }, []);

//   const foregroundListener = useCallback(() => {
//     messaging().onMessage(async message => {
//       console.log('foreground', message)
//     })
//   }, [])
      
//   useEffect(() => {
//     foregroundListener()  
//   }, [])

//   useEffect(() => {
//     fcmService.registerAppWithFCM();
//     fcmService.register(onRegister, onNotification, onOpenNotification);
//     localNotificationService.configure(onOpenNotification);

//     function onRegister(token) {
//       console.log('[App] onRegister : token :', token);
//     }

//     function onNotification(notify) {
//       console.log('[App] onNotification : notify :', notify);
//       const options = {
//         soundName: 'default',
//         playSound: true,
//       };
//       localNotificationService.showNotification(
//         0,
//         notify.title,
//         notify.body,
//         notify,
//         options,
//       );
//     }

//     function onOpenNotification(notify) {
//       console.log('[App] onOpenNotification : notify :', notify);
//       alert('Open Notification : notify.body :' + notify.body);
//     }
//     return () => {
//       console.log('[App] unRegister');
//       fcmService.unRegister();
//       localNotificationService.unregister();
//     };
//   }, []);
//   return (
//     <> 
//       <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
//       <SafeAreaView style={styles.root}>
//         <MyWebView 
//           // handleClose={()=>{
//           //   Alert.alert('앱 종료', '앱을 종료하시겠습니까?', [
//           //     {
//           //       text: '아니오',
//           //       onPress: () => null,
//           //     },
//           //     {text: '예', onPress: () => BackHandler.exitApp()},
//           //   ]);
//           // }}
//           />
//       </SafeAreaView>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });