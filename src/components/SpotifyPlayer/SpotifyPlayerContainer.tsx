import React, {
  MutableRefObject,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {StyleSheet} from 'react-native';
import WebView from 'react-native-webview';
import {SpotifyPlayer, IPlayerParams} from '.';

interface IProps extends IPlayerParams {
  uri: string;
}
export type IPlayerHandler = {
  play: () => void;
};

const SpotifyPlayerContainer = React.forwardRef<IPlayerHandler, IProps>(
  (props: IProps, ref) => {
    const {uri} = props;
    const webviewRef = useRef() as MutableRefObject<WebView>;

    const [html, setHtml] = useState<string>('');

    useLayoutEffect(() => {
      return setHtml(SpotifyPlayer({uri}));
    }, [uri]);

    return (
      <WebView
        allowsInlineMediaPlayback
        javaScriptEnabled
        ref={webviewRef}
        scrollEnabled={false}
        source={{html}}
        style={styles.container}
      />
    );
  },
);

const styles = StyleSheet.create({
  container: {
    height: 100,
    width: '100%',
    opacity: 0.99,
    overflow: 'hidden',
  },
});

export {SpotifyPlayerContainer};
