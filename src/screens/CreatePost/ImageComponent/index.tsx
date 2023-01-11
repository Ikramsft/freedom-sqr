/**
 * @format
 */
import React from 'react';
import {View, Image, CloseIcon} from 'native-base';

import {AppTheme} from 'theme';
import {SafeTouchable} from 'components';

import {calculateHeightWidth} from '../../../utils';

interface IImageProps {
  uri: string;
  onRemove: (() => void) | undefined;
  imgHeight: number;
  imgWidth: number;
  theme: AppTheme;
}

function ImageComponent(props: IImageProps) {
  const {uri, onRemove, imgHeight, imgWidth, theme} = props;

  const {width, height} = calculateHeightWidth(imgHeight, imgWidth, 0.8);

  return (
    <View alignSelf="center" height={height} mt={4} width={width}>
      <Image
        alt="ImageName"
        height={height}
        resizeMode="contain"
        source={{uri}}
        width={width}
      />
      <View
        borderRadius={15}
        height={30}
        position="absolute"
        right={-20}
        top={-10}
        width={30}>
        <SafeTouchable onPress={onRemove}>
          <View
            alignItems="center"
            backgroundColor={theme.colors.white[900]}
            borderRadius="10px"
            height="20px"
            width="20px">
            <CloseIcon size="15px" />
          </View>
        </SafeTouchable>
      </View>
    </View>
  );
}

export {ImageComponent};
