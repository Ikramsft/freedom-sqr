import React, {useRef, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import {SafeAreaView} from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import {Slider} from 'native-base';

import {
  SavePayload,
  MediaPicker,
  IAssetType,
  PickerHandle,
  Button,
} from 'components';
import {
  CropperContainer,
  ICropperHandler,
  ICropperImageData,
} from 'components/ImageCropper/CropperContainer';
import {PicCroppedDetails} from './interfaces';
import {useAppTheme} from '../../theme/useTheme';

export interface ISavePayload extends SavePayload {
  zoom: number;
  minZoom: number;
  originalFile: string;
}

type IProps = {
  title?: string;
  open: boolean;
  handleClose: () => void;
  handleSave: (data: ISavePayload) => void;
  image: string;
  aspectRatio: number;
  initialAspectRatio: number;
  enableZoom: boolean | undefined;
  rounded: boolean | undefined;
  allowGif: boolean | undefined;
  avatarMaxSize: number | undefined;
  selectFile: (file: IAssetType) => void;
  avatarViewAttribute?: PicCroppedDetails;
  coverViewAttribute?: PicCroppedDetails;
  validImageWidth?: number;
  validImageHeight?: number;
  onError?: () => void;
};

type IHeaderProps = {
  title: string;
  handleClose: () => void;
};

type IImageData = {
  minZoom: number;
  zoom: number;
  isReady: boolean;
};

function HeaderButton(props: IHeaderProps) {
  const {title, handleClose} = props;
  const {colors} = useAppTheme();
  return (
    <View
      style={[styles.headerContainer, {backgroundColor: colors.white[900]}]}>
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>{title}</Text>
        <TouchableOpacity onPress={handleClose}>
          <Feather name="x" size={25} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ImageCropper(props: IProps) {
  const {
    title = 'Upload Avatar',
    open,
    enableZoom,
    handleClose,
    handleSave,
    rounded = false,
    avatarViewAttribute,
    selectFile,
    image,
    validImageWidth,
    validImageHeight,
    onError,
    ...rest
  } = props;
  const theme = useAppTheme();

  const cropperRef = useRef<ICropperHandler>(null);
  const mediaPicker = React.useRef<PickerHandle>(null);
  const [imageData, setImageData] = useState<IImageData>({
    minZoom: 0,
    zoom: 0,
    isReady: false,
  });

  const onSave = (croppedPayload: SavePayload) => {
    const {zoom, minZoom} = imageData;
    const data = {...croppedPayload, originalFile: image, zoom, minZoom};
    handleSave(data);
  };

  const onReady = (payload: ICropperImageData) => {
    const calculated = Math.floor((payload.width / payload.naturalWidth) * 10);
    const zoomValue = Math.floor((calculated + (calculated + 10)) / 2);
    setImageData({isReady: true, minZoom: calculated, zoom: zoomValue});
  };

  const handleError = () => {
    setImageData({...imageData, isReady: false});
    onError?.();
  };

  const handleZoom = (value: number) => {
    setImageData({...imageData, zoom: value});
  };

  const showSpinner = !image || !imageData.isReady;
  const opacity = !showSpinner ? 1 : 0;

  const minusZoom = () => {
    let value = imageData.zoom - 1;
    if (value <= imageData.minZoom) {
      value = imageData.minZoom;
    }
    handleZoom(value);
  };

  const plusZoom = () => {
    let value = imageData.zoom + 1;
    if (value >= imageData.minZoom + 10) {
      value = imageData.minZoom + 10;
    }
    handleZoom(value);
  };

  return open ? (
    <Modal
      isVisible={open}
      style={[styles.modal, {backgroundColor: theme.colors.transparent}]}>
      {showSpinner ? (
        <TouchableOpacity style={styles.spinnerContainer} onPress={handleClose}>
          <ActivityIndicator size="small" />
        </TouchableOpacity>
      ) : null}
      <SafeAreaView
        edges={['top', 'bottom']}
        style={[
          styles.safeAreaContainer,
          {opacity, backgroundColor: theme.colors.white[900]},
        ]}>
        <View>
          <View style={styles.contentContainer}>
            <View style={styles.container}>
              <HeaderButton handleClose={handleClose} title={title} />
              <CropperContainer
                {...rest}
                cropBoxMovable
                cropBoxResizable
                modal
                zoomOnTouch
                autoCropArea={1}
                background={false}
                center={false}
                cropperAttributes={avatarViewAttribute}
                dragMode="move"
                guides={false}
                image={image}
                ref={cropperRef}
                restore={false}
                rounded={rounded}
                toggleDragModeOnDblclick={false}
                viewMode={1}
                zoom={imageData.zoom / 10}
                zoomOnWheel={false}
                onReady={onReady}
                onSave={onSave}
              />
            </View>
          </View>

          <View style={styles.footerContainer}>
            {enableZoom ? (
              <View style={styles.zoomContainer}>
                <TouchableOpacity onPress={minusZoom}>
                  <Feather name="zoom-out" size={25} />
                </TouchableOpacity>
                <View style={styles.sliderContainer}>
                  <Slider
                    accessibilityLabel="Image Zoom"
                    colorScheme="darkBlue"
                    defaultValue={0}
                    maxValue={imageData.minZoom + 10}
                    minValue={imageData.minZoom}
                    size="md"
                    step={1}
                    value={imageData.zoom}
                    onChangeEnd={handleZoom}>
                    <Slider.Track>
                      <Slider.FilledTrack />
                    </Slider.Track>
                    <Slider.Thumb />
                  </Slider>
                </View>
                <TouchableOpacity onPress={plusZoom}>
                  <Feather name="zoom-in" size={25} />
                </TouchableOpacity>
              </View>
            ) : null}
            <View style={styles.buttonContainer}>
              <Button
                title=" Change Image"
                width="48%"
                onPress={() => mediaPicker.current?.onPickerSelect()}
              />
              <Button
                color={theme.colors.white[900]}
                title="Save"
                width="48%"
                onPress={cropperRef?.current?.applyImage}
              />
            </View>
          </View>
          <MediaPicker
            options={{mediaType: 'photo', includeBase64: true}}
            ref={mediaPicker}
            validImageHeight={validImageHeight}
            validImageWidth={validImageWidth}
            onError={handleError}
            // main file select func
            onSelectImage={selectFile}
          />
        </View>
      </SafeAreaView>
    </Modal>
  ) : null;
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  headerContainer: {
    left: 0,
    paddingBottom: 10,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 9,
  },
  footerContainer: {
    bg: '#fff',
    bottom: 0,
    position: 'absolute',
    width: '100%',
  },
  spinnerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
  },
  heading: {
    fontWeight: '500',
    fontSize: 18,
  },
  safeAreaContainer: {
    paddingVertical: 50,
    paddingHorizontal: 10,
    width: '100%',
    justifyContent: 'space-between',
  },
  modal: {
    margin: 0,
    flex: 1,
    position: 'relative',
  },
  contentContainer: {
    flexGrow: 1,
    position: 'relative',
  },
  headingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },

  zoomContainer: {
    marginTop: 25,
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    bottom: 15,
  },
  sliderContainer: {
    flex: 1,
    marginHorizontal: 20,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
  },
});

ImageCropper.defaultProps = {
  avatarViewAttribute: undefined,
  coverViewAttribute: undefined,
  title: 'Upload Avatar',
  validImageWidth: undefined,
  validImageHeight: undefined,
  onError: undefined,
};

export {ImageCropper};
export * from './interfaces';
