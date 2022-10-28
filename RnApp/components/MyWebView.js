import React, {useRef, useEffect, useState} from 'react';
import {Alert, BackHandler} from 'react-native';
import {WebView} from 'react-native-webview';

const MyWebView= () => {
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
      }}
    />
  );
};

export default MyWebView;