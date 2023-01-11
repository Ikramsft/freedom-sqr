/**
 * @format
 */

import React, {forwardRef, useImperativeHandle} from 'react';
// eslint-disable-next-line react-native/split-platform-components
import {PermissionsAndroid, View, Image} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import {
  Asset,
  ImageLibraryOptions,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {showSnackbar} from 'utils/SnackBar';
import {isAndroid} from '../../constants/common';
import {ISavePayload} from '../ImageCropper/interfaces';

const photoOptions: ImageLibraryOptions = {
  mediaType: 'photo',
  maxWidth: 1600,
  maxHeight: 1600,
  includeBase64: false,
};

export interface ISelectFile extends Omit<ISavePayload, 'originalFile'> {
  originalFile: ISelectedMedia;
}

export interface IMedia {
  uri: string;
  name: string;
  type: string;
}

export type ImageUpdateType = 'cover' | 'avatar';

const ImageSource = {gallery: 0, camera: 1, none: 2};
export interface ISelectedMedia extends IMedia {
  base64: string;
}

type ImageSource = 'gallery' | 'camera';
export type IAssetType = Asset;

interface IPickerProps {
  onError?: () => void;
  validImageWidth?: number;
  validImageHeight?: number;
  onSelectImage: (image: IAssetType) => void;
  options?: ImageLibraryOptions;
}

export type IPressHandler = {
  onPickerSelect: (type?: ImageSource) => void;
};
const optionArray = ['Photo Library', 'Use Camera', 'Cancel'];
const MediaPicker = forwardRef<IPressHandler, IPickerProps>(
  (props: IPickerProps, ref) => {
    useImperativeHandle(ref, () => ({onPickerSelect: onOpen}));
    const actionRef = React.useRef<ActionSheet>(null);

    const onOpen = () => {
      actionRef?.current?.show();
    };

    const {
      onSelectImage,
      options,
      validImageWidth = 640,
      validImageHeight = 480,
      onError,
    } = props;
    const onUseCameraPress = () =>
      isAndroid ? requestCameraPermission() : showCamera();

    const requestCameraPermission = async () => {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'App Camera Permission',
          message: 'App needs access to your camera ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        showCamera();
      }
    };

    const handleResponse = async (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorCode) {
        return;
      }
      const image = response.assets?.[0];

      if (image) {
        if (image && image?.uri) {
          try {
            await imageValidation(image?.uri);
            onSelectImage?.(image);
          } catch (ex: any) {
            onError?.();
            showSnackbar({
              message: `The images resolution must be ${validImageWidth} x ${validImageHeight} or higher.`,
              type: 'error',
            });
          }
        }
      }
    };
    const imageValidation = (uri: string) => {
      return new Promise((resolve, reject) => {
        Image.getSize(uri || '', (width, height) => {
          const validFile =
            width && height
              ? width >= validImageWidth && height >= validImageHeight
              : false;
          if (validFile) {
            resolve('valid image');
          } else {
            reject();
          }
        });
      });
    };

    const showGallery = async () => {
      if (options) {
        launchImageLibrary(options, handleResponse);
      }
    };

    const showCamera = () => {
      if (options) {
        launchCamera(options, handleResponse);
      }
    };

    const onPress = (index: number) => {
      switch (index) {
        case 0:
          showGallery();
          break;
        case 1:
          onUseCameraPress();
          break;
        default:
          break;
      }
    };

    return (
      <View>
        <ActionSheet
          cancelButtonIndex={optionArray.length - 1}
          options={optionArray}
          ref={actionRef}
          title="Please select source:"
          onPress={onPress}
        />
      </View>
    );
  },
);

MediaPicker.defaultProps = {
  options: photoOptions,
  onError: undefined,
  validImageWidth: undefined,
  validImageHeight: undefined,
};

export type PickerHandle = React.ElementRef<typeof MediaPicker>;
export {MediaPicker};
