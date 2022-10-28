import React, { useState, useEffect, useCallback } from 'react';
import messaging from '@react-native-firebase/messaging';
import {fcmService} from './src/FCMService';
import {localNotificationService} from './src/LocalNotificationService';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import MyWebView from './components/MyWebView';
import ModalStyle from './components/popup/ModalStyle';

const App = () => {
  useEffect(() => {
    // message start 
    fcmService.registerAppWithFCM();
    fcmService.register(onRegister, onNotification, onOpenNotification);
    localNotificationService.configure(onOpenNotification);

    function onRegister(token) {
      console.log('token :', token);
    }

    function onNotification(notify) {
      console.log('[App] onNotification : notify :');
      const options = {
        soundName: 'default',
        playSound: true,
      };
      localNotificationService.showNotification(
        0,
        notify.title,
        notify.body,
        notify,
        options,
      );
    }

    function onOpenNotification(notify) {
      console.log('[App] onOpenNotification : notify :');
    }
    return () => {
      console.log('[App] unRegister');
      fcmService.unRegister();
      localNotificationService.unregister();
    };
  }, []);

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
    foregroundListener();
  }, [])
    // message end 
    
  return (
    <> 
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <SafeAreaView style={styles.root}>
        <MyWebView />
      </SafeAreaView>
    </>
  );
  // return (
  //   <> 
  //     <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
  //     <SafeAreaView style={styles.root}>
  //       <MyWebView />
  //     </SafeAreaView>
  //   </>
  // );
};

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;