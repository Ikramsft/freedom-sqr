import React, {useCallback, useMemo} from 'react';
import {TouchableOpacity, Keyboard} from 'react-native';
import {View, Text, Spinner} from 'native-base';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {InterfaceViewProps} from 'native-base/lib/typescript/components/basic/View/types';

import {
  MediaPicker,
  IAssetType,
  IPressHandler,
  ISelectedMedia,
  ISelectFile,
} from '../MediaPicker';

import {validateImage} from '../../utils/validator';
import {ImageCropper} from '../ImageCropper';
import {ISavePayload, PicCroppedDetails} from '../ImageCropper/interfaces';
import {getImageExtension} from '../../utils';
import {useAppTheme} from '../../theme/useTheme';
import {isAndroid} from '../../constants';
import {ImageLoader} from './ImageLoader';
import {TrashIcon} from './TrashIcon';
import {EditIcon} from './EditIcon';
import {SelectionUI} from './SelectionUI';
import {useConfirmModal} from '../ConfirmationModel';
import {SubTitle} from '../Typography';
import {AppTheme} from '../../theme/theme';
import {ProgressImage} from '../ProgressImage';

export type ExtraInfoType = {[key: string]: string};

interface Props extends InterfaceViewProps {
  size?: number;
  height?: number;
  width?: string | number;
  subTitle?: string;
  editable?: boolean;
  removable?: boolean;
  allowGif?: boolean;
  uriImage: string;
  originalImage?: string;
  imageViewAttribute?: PicCroppedDetails;
  selectFile: (payload: ISelectFile, extraInfo: ExtraInfoType) => void;
  onDelete?: (info: ExtraInfoType) => void;
  deleting: boolean;
  uploading: boolean;
  retainImage?: boolean;
  extraInfo: ExtraInfoType;
  aspectRatio?: number;
  renderSelectionUI?: JSX.Element | undefined;
}

const IMAGE_MAX_SIZE = 150;

export interface IPickerProps {
  theme: AppTheme;
}

export function CommonImagePicker(props: Props) {
  const {
    size,
    subTitle,
    height,
    allowGif,
    width,
    editable,
    removable,
    uriImage,
    imageViewAttribute,
    originalImage,
    selectFile,
    onDelete,
    renderSelectionUI,
    deleting,
    uploading,
    extraInfo,
    retainImage,
    aspectRatio,
    ...containerProps
  } = props;

  const theme = useAppTheme();

  const [isLoadingImage, setIsLoadingImage] = React.useState<boolean>(false);

  const mediaPicker = React.useRef<IPressHandler>(null);

  const [selectedImage, setSelectedImage] = React.useState<ISelectedMedia>();
  const [cropper, setCropper] = React.useState<boolean>(false);
  const [imageBase64, setImageBase64] = React.useState<string>('');
  const [filePath, setFilePath] = React.useState<string>('');

  const {uriArr2: fileExtension, filename: getFileName} = useMemo(
    () => getImageExtension(originalImage || ''),
    [originalImage],
  );

  const [image, setImage] = React.useState<string>(uriImage || '');

  React.useEffect(() => {
    if (image !== uriImage) {
      setImage(uriImage);
    }
  }, [image, uriImage]);

  const confirm = useConfirmModal();

  const clearImage = async () => {
    confirm?.show?.({
      title: <SubTitle fontSize={18}>Delete image</SubTitle>,
      message: (
        <Text>
          <Text>Are you sure you want to delete this image?</Text>
        </Text>
      ),
      onConfirm: () => onDelete?.(extraInfo),
      submitLabel: 'YES',
      cancelLabel: 'CANCEL',
    });
  };

  const toggleCropper = () => {
    setCropper(v => {
      if (v) {
        setSelectedImage(undefined);
        setImageBase64('');
        setFilePath('');
      }
      return !v;
    });
  };

  const onSelectImage = (file: IAssetType) => {
    if (file) {
      const {
        fileName: name = '',
        type: fileType = '',
        uri = '',
        fileSize = 0,
        base64 = '',
      } = file;
      if (name && fileType) {
        const allowedTypes = allowGif
          ? /(\.jpg|\.jpeg|\.gif|\.png)$/i
          : /(\.jpg|\.jpeg|\.png)$/i;
        const maxSize = 100;
        const validated = validateImage(
          name,
          fileType,
          fileSize || 0,
          maxSize,
          allowedTypes,
        );
        if (validated) {
          const b64 = `data:${fileType};base64,${base64}`;
          const sFile = {uri, type: fileType, name, base64: b64};
          setSelectedImage(sFile);
          setCropper(true);
        }
      }
    }
  };

  const handleSave = (data: ISavePayload) => {
    toggleCropper();
    if (selectedImage) {
      selectFile({...data, originalFile: selectedImage}, extraInfo);
      setImage(data.croppedFile);
    } else {
      const selectImageObjects = {
        base64: `data:image/${fileExtension};base64,${imageBase64}`,
        name: getFileName,
        type: `image/${fileExtension}`,
        uri: filePath,
      };
      selectFile({...data, originalFile: selectImageObjects}, extraInfo);
      setImage(data.croppedFile);
    }
    setSelectedImage(undefined);
    setImageBase64('');
    setFilePath('');
  };

  const onPressImage = () => {
    Keyboard.dismiss();
    setIsLoadingImage(false);
    if (image) {
      toggleCropper();
      convert();
    } else {
      mediaPicker.current?.onPickerSelect();
    }
  };

  const convert = useCallback(() => {
    try {
      const link = originalImage || '';
      ReactNativeBlobUtil.fetch('GET', link || '')
        .then(res => {
          const {status} = res.info();
          if (status === 200) {
            const base64Str = res.base64();
            setImageBase64(base64Str);
          }
        })
        .catch(error => {
          console.log('-----> error', error);
        });

      ReactNativeBlobUtil.config({fileCache: true, appendExt: fileExtension})
        .fetch('GET', link || '')
        .then(res => {
          setFilePath(isAndroid ? `file://${res.path()}` : `${res.path()}`);
        })
        .catch(error => {
          console.log('-----> error', error);
        });
    } catch (err) {
      console.log('-----> err', err);
    }
  }, [fileExtension, originalImage]);

  const onError = () => {
    toggleCropper();
    setCropper(false);
  };

  return (
    <View {...containerProps}>
      <TouchableOpacity
        activeOpacity={!editable ? 0.9 : 1}
        disabled={isLoadingImage}
        onPress={onPressImage}>
        <View
          alignItems="center"
          height={height}
          justifyContent="center"
          width={width}>
          <ImageCropper
            enableZoom
            allowGif={allowGif}
            aspectRatio={aspectRatio || 1}
            avatarMaxSize={IMAGE_MAX_SIZE}
            avatarViewAttribute={
              !selectedImage ? imageViewAttribute : undefined
            }
            handleClose={toggleCropper}
            handleSave={handleSave}
            image={
              selectedImage
                ? selectedImage?.base64 || ''
                : imageBase64
                ? `data:image/${fileExtension};base64,${imageBase64}`
                : ''
            }
            initialAspectRatio={1 / 1}
            open={cropper}
            rounded={false}
            selectFile={onSelectImage}
            validImageHeight={480}
            validImageWidth={640}
            onError={onError}
          />
          {uriImage && editable && (
            <EditIcon
              disabled={isLoadingImage}
              theme={theme}
              onPress={onPressImage}
            />
          )}
          {uriImage && removable && (
            <TrashIcon deleting={deleting} theme={theme} onPress={clearImage} />
          )}
          {uploading ? (
            <Spinner position="absolute" />
          ) : image && retainImage ? (
            <ProgressImage
              borderRadius={5}
              height="100%"
              source={{uri: image}}
              width="100%"
            />
          ) : (
            <SelectionUI
              iconSize={size}
              renderSelectionUI={renderSelectionUI}
              subTitle={subTitle}
              theme={theme}
            />
          )}
          <ImageLoader isLoading={isLoadingImage} theme={theme} />
          <MediaPicker
            options={{mediaType: 'photo', includeBase64: true}}
            ref={mediaPicker}
            validImageHeight={480}
            validImageWidth={640}
            onError={onError}
            onSelectImage={onSelectImage}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

CommonImagePicker.defaultProps = {
  size: 75,
  subTitle: 'Upload Image',
  editable: false,
  removable: false,
  height: 150,
  width: 150,
  allowGif: false,
  imageViewAttribute: undefined,
  originalImage: '',
  onDelete: () => null,
  renderSelectionUI: undefined,
  retainImage: true,
  aspectRatio: 1,
};
