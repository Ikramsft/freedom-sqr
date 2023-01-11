/**
 * @format
 */
import React from 'react';
import {ActivityIndicator, ImageRequireSource, StyleSheet} from 'react-native';
import {createImageProgress} from 'react-native-image-progress';
import FastImage, {ResizeMode, Source} from 'react-native-fast-image';
import {View} from 'native-base';
import {IViewProps} from 'native-base/lib/typescript/components/basic/View/types';

const Image = createImageProgress(FastImage);

interface Props extends IViewProps {
  resizeMode?: ResizeMode | undefined;
  source?: Source | ImageRequireSource;
}

function ProgressImageView(props: Props) {
  const {resizeMode, source, ...rest} = props;

  const fromWeb = typeof source !== 'number';

  const imgSource = fromWeb ? source : {uri: (source as Source).uri};

  const indicator = () => <ActivityIndicator />;

  const key = fromWeb ? imgSource?.uri : `local-image-${imgSource}`;

  return (
    <View
      alignItems="center"
      borderRadius={4}
      justifyContent="center"
      key={key}
      overflow="hidden"
      {...rest}>
      <Image
        indicator={indicator}
        key={`image-${key}`}
        resizeMode={resizeMode}
        source={imgSource}
        style={styles.image}
      />
    </View>
  );
}

ProgressImageView.defaultProps = {
  source: undefined,
  resizeMode: 'cover',
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
});

const ProgressImage = React.memo(ProgressImageView, (p, n) => p !== n);

export {ProgressImage};
