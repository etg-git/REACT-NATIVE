import React, { useRef, useState, useEffect, useCallback } from 'react';
// import { Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {fcmService} from './src/FCMService';
import {localNotificationService} from './src/LocalNotificationService';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  Alert,
  BackHandler,
} from 'react-native';
import { WebView } from 'react-native-webview';

const App = () => {
  const webview = useRef();
  const BASE_URL = 'https://safetydoumi-m.andami.kr';
  const [isNotBackUrl, setIsNotBackUrl] = useState(false); // 특정 url 여부
  const [isCanGoBack, setIsCanGoBack] = useState(false); // history back이 더이상 없을경우

  const onPressHardwareBackButton = () => {
    if (webview.current && isCanGoBack && isNotBackUrl) {
      webview.current.goBack();
      return true;
    } else {
        Alert.alert('앱 종료하기', '앱을 종료하시겠습니까?', [
        {
          text: '취소',
          onPress: () => {
            null
          },
        },
        { 
          text: '확인', 
          onPress: () => {
            BackHandler.exitApp()
          },
        }                                                                                 
      ]);
      return true;
    }
  };
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onPressHardwareBackButton);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onPressHardwareBackButton);
    }
  }, [isCanGoBack, isNotBackUrl]);

  useEffect(() => {
    fcmService.registerAppWithFCM();
    fcmService.register(onRegister, onNotification, onOpenNotification);
    localNotificationService.configure(onOpenNotification);

    function onRegister(token) {
      console.log('token :', token);
    }

    function onNotification(notify) {
      console.log('[App] onNotification : notify :', notify);
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
      console.log('[App] onOpenNotification : notify :', notify);
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
  return (
    <WebView
      ref={webview}
      style={{
        overflow: 'hidden',
        opacity: .99,
      }}
      pullToRefreshEnabled={true}
      startInLoadingState={true}
      allowsBackForwardNavigationGestures={true}
      // HTML이나, uri를 적어주는 부분
      source={{uri: BASE_URL}} 
      mixedContentMode={'compatibility'}
      originWhitelist={['https://*', 'http://*']}
      overScrollMode={'never'}
      // ref={(ref) => setWebview(ref)}
      // View가 로드될 때 자바스크립트를 웹 페이지에 주입
      injectedJavaScript={`
        (function() {
          function wrap(fn) {
            return function wrapper() {
              var res = fn.apply(this, arguments);
              window.ReactNativeWebView.postMessage('navigationStateChange');
              return res;
            }
          }
    
          history.pushState = wrap(history.pushState);
          history.replaceState = wrap(history.replaceState);
          window.addEventListener('popstate', function() {
            window.ReactNativeWebView.postMessage('navigationStateChange');
          });
        })();
    
        true;
      `}
      onMessage={({ nativeEvent: state }) => {
        if (state.url === 'https://safetydoumi-m.andami.kr/' || state.url === 'https://safetydoumi-m.andami.kr/404') {
          setIsNotBackUrl(false);
        } else if (state.data === 'navigationStateChange') {
          if (state.url === 'https://safetydoumi-m.andami.kr/main/index') {
            setIsNotBackUrl(false);
            setIsCanGoBack(state.canGoBack);
          } else {
            setIsNotBackUrl(true);
            setIsCanGoBack(state.canGoBack);
          }
      }
    }}/>
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