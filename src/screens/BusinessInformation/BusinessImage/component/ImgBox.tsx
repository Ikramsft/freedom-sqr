/**
 * @format
 */
import {View, Text} from 'native-base';
import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {useAppTheme} from 'theme';

export type ImageType = 'logo' | 'media' | 'background' | '';

interface IImageBox {
  height?: string | number;
  width?: string | number;
  innerTextFirst?: string;
  innerTextSecond?: string;
}

function BusinessImageSelectionUI(props: IImageBox) {
  const theme = useAppTheme();

  const {height, width, innerTextFirst, innerTextSecond} = props;

  return (
    <View height={height} justifyContent="center" width={width}>
      <View
        alignItems="center"
        bg={theme.colors.gray[200]}
        borderRadius={5}
        borderStyle="dotted"
        borderWidth={1}
        flex={1}
        justifyContent="center">
        <Entypo color={theme.colors.red[800]} name="plus" size={25} />
        <FontAwesome name="image" size={20} />
        <Text fontSize="10" fontWeight="500" opacity="0.5">
          {innerTextFirst}
        </Text>
        <Text fontSize="10" fontWeight="500" opacity="0.5">
          {innerTextSecond}
        </Text>
      </View>
    </View>
  );
}

BusinessImageSelectionUI.defaultProps = {
  innerTextFirst: 'Upload Image',
  innerTextSecond: '',
  width: '100%',
  height: '100%',
};

export {BusinessImageSelectionUI};
