/**
 * @format
 */
import React from 'react';
import {useSelector} from 'react-redux';
import {CloseIcon, View} from 'native-base';
import {ReactNativeZoomableView} from '@openspacelabs/react-native-zoomable-view';

import {RootState} from '../../redux/store';
import {useImageGallery} from '../../redux/gallery';
import {useAppTheme} from '../../theme/useTheme';
import {SafeTouchable} from '../SafeTouchable';
import {ProgressImage} from '../ProgressImage';
import {useBackHandler} from '../../hooks/useBackHandler';
import {SafeAreaContainer} from '../SafeAreaContainer';
import {isAndroid} from '../../constants';

function ImageGallery() {
  const {hideGallery} = useImageGallery();

  const {visible, imageData} = useSelector((state: RootState) => state.gallery);

  const theme = useAppTheme();

  let imageUrl;

  if (imageData.length > 0) {
    imageUrl = imageData[0].uri;
  }

  useBackHandler(() => {
    if (visible) {
      hideGallery();
      return true;
    }
    return false;
  });

  if (visible) {
    return (
      <SafeAreaContainer
        edges={['top', 'bottom']}
        style={{backgroundColor: theme.colors.black[400]}}>
        <View
          backgroundColor={theme.colors.black[400]}
          padding={2}
          zIndex={9999}>
          <View height="100%" width="100%">
            <ReactNativeZoomableView maxZoom={5} minZoom={1}>
              <View height="100%" width="100%">
                <ProgressImage
                  height="100%"
                  resizeMode="contain"
                  source={{uri: imageUrl}}
                  width="100%"
                />
              </View>
            </ReactNativeZoomableView>
          </View>
          <View
            alignItems="center"
            backgroundColor={theme.colors.gray[800]}
            height="25px"
            justifyContent="center"
            position="absolute"
            right="10px"
            rounded="full"
            top={isAndroid ? '10px' : '0px'}
            width="25px">
            <SafeTouchable onPress={hideGallery}>
              <CloseIcon color={theme.colors.white[900]} size={3} />
            </SafeTouchable>
          </View>
        </View>
      </SafeAreaContainer>
    );
  }
  return null;
}

export {ImageGallery};
