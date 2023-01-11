/**
 * @format
 */
import React from 'react';
import {StyleSheet} from 'react-native';
import {Spinner, View} from 'native-base';

import {IPickerProps} from './index';

interface ILoaderProps extends IPickerProps {
  isLoading: boolean;
}

export function ImageLoader(props: ILoaderProps) {
  const {theme, isLoading} = props;
  const {colors} = theme;
  if (isLoading) {
    return (
      <View
        alignItems="center"
        borderRadius={5}
        justifyContent="center"
        style={StyleSheet.absoluteFill}
        zIndex={11}>
        <Spinner color={colors.black[400]} />
      </View>
    );
  }
  return null;
}
