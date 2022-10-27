import React, {useEffect, useState} from 'react';
import {BackHandler} from 'react-native';
import {WebView} from 'react-native-webview';

const MyWebView= ({handleClose}) => {
  const BASE_URL = 'https://safetydoumi-m.andami.kr';
  // const [webview, setWebview] = useState();
  // const [goBackable, setGoBackable] = useState(false);
  // useEffect(() => {
  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     () => {
  //       console.log('goBackable', goBackable);
  //       if (goBackable) webview.goBack();
  //       else handleClose();
  //       return true;
  //     },
  //   );
  //   return () => backHandler.remove();
  // }, [goBackable]);

  // useEffect(() => {
  //   if (webview && webview.clearCache) webview.clearCache();
  // }, [webview]);
  return (
    <WebView
      pullToRefreshEnabled={true}
      startInLoadingState={true}
      allowsBackForwardNavigationGestures={true}
      // HTML이나, uri를 적어주는 부분
      source={{uri: BASE_URL}} 
      mixedContentMode={'compatibility'}
      originWhitelist={['https://*', 'http://*']}
      overScrollMode={'never'}
      // ref={(ref) => setWebview(ref)}

      injectedJavaScript={` 
      (function() {
          function wrap(fn) {
          return function wrapper() {
              var res = fn.apply(this, arguments);
              window.ReactNativeWebView.postMessage(window.location.href);
              return res;
          }
          }
          history.pushState = wrap(history.pushState);
          history.replaceState = wrap(history.replaceState);
          window.addEventListener('popstate', function() {
          window.ReactNativeWebView.postMessage(window.location.href);
          });
      })();
      true;
      `}

      // WebView가 window.postMessage를 call하면 호출되는 것
      onMessage={(event) => {
        console.log('onMessage', event.nativeEvent.data);
      }}
    />
  );
};

export default MyWebView;