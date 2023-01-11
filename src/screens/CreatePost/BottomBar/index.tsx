/**
 * @format
 */
import React from 'react';
import {Keyboard, StyleProp, TextStyle} from 'react-native';
import {View, Spinner, Text} from 'native-base';
import {KeyboardAccessoryView} from 'react-native-keyboard-accessory';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

import {AppTheme} from 'theme';
import {SafeTouchable, MediaPicker, IAssetType, PickerHandle} from 'components';

import {validateImage} from '../../../utils/validator';

interface Props {
  isLoading: boolean;
  canSubmit: boolean;
  theme: AppTheme;
  setFieldValue: any;
  handleSubmit: any;
}

function BottomBar(props: Props) {
  const {isLoading, canSubmit, theme} = props;

  const {setFieldValue, handleSubmit} = props;

  const mediaPicker = React.useRef<PickerHandle>(null);

  const onSelectImage = (file: IAssetType) => {
    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    const fileType: string = file.type!;
    const fileSize: number = file.fileSize!;
    const fileUri: string = file.uri!;
    const fileHeight: number = file.height!;
    const fileWidth: number = file.width!;

    const fileName: string = file.fileName!;
    const allowedSize = 100;
    if (validateImage(fileName, fileType, fileSize, allowedSize)) {
      setFieldValue('mediaContent', {
        uri: fileUri,
        type: fileType,
        name: fileName,
        height: fileHeight,
        width: fileWidth,
      });
    }
  };

  const selectAddMedia = () => {
    mediaPicker.current?.onPickerSelect();
    Keyboard.dismiss();
  };

  const style: StyleProp<TextStyle> = {
    color: canSubmit ? theme.colors.brand[900] : theme.colors.gray[400],
  };

  return (
    <KeyboardAccessoryView
      alwaysVisible
      androidAdjustResize
      avoidKeyboard
      style={{backgroundColor: theme.colors.white['700']}}>
      <View flexDirection="row" justifyContent="space-between" p={2}>
        <SafeTouchable onPress={selectAddMedia}>
          <View alignItems="center" flexDirection="row">
            <Icon color="#A9A9A9" name="camera" size={22} />
            <Text px="1">Add Media</Text>
          </View>
        </SafeTouchable>
        <View flexDirection="row" height={30} width={30}>
          <SafeTouchable disabled={!canSubmit} onPress={() => handleSubmit()}>
            <View alignItems="center" justifyContent="center">
              {isLoading ? (
                <Spinner alignSelf="center" color="#959699" />
              ) : (
                <Ionicons name="send-outline" size={22} style={style} />
              )}
            </View>
          </SafeTouchable>
        </View>
      </View>
      <MediaPicker
        options={{mediaType: 'photo'}}
        ref={mediaPicker}
        onSelectImage={onSelectImage}
      />
    </KeyboardAccessoryView>
  );
}

export {BottomBar};
