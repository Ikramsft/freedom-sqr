/**
 * @format
 */
import React, {useCallback, useMemo} from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import {View, Text} from 'native-base';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {useDispatch} from 'react-redux';
import {useQueryClient} from 'react-query';

import {ImageCropper} from 'components/ImageCropper';

import {
  MediaPicker,
  IAssetType,
  IPressHandler,
  ISelectedMedia,
  ISelectFile,
} from '../MediaPicker';
import {validateImage} from '../../utils/validator';
import {ISavePayload, PicCroppedDetails} from '../ImageCropper/interfaces';
import {getImageExtension} from '../../utils';
import {useAppTheme} from '../../theme/useTheme';
import {isAndroid} from '../../constants';
import {showSnackbar} from '../../utils/SnackBar';
import {uploadProfile} from '../../screens/Profile/ProfileInformation/useProfileImageOperations';
import {useUserActions} from '../../redux/user';
import {QueryKeys} from '../../utils/QueryKeys';
import {useUserInfo} from '../../hooks/useUserInfo';
import {InfluencerTickIcon} from '../../assets/svg';

interface UserIconProps {
  subTitle?: string;
  fontSize?: number;
  editable?: boolean;
  allowGif?: boolean;
  uriAvatar: string;
  originalAvatar?: string;
  avatarViewAttribute?: PicCroppedDetails;
}

const AVATAR_MAX_SIZE = 150;

export function Avatar(props: UserIconProps) {
  const {
    subTitle,
    fontSize,
    allowGif,
    editable,
    uriAvatar,
    avatarViewAttribute,
    originalAvatar,
  } = props;

  const {updateProfilePic} = useUserActions();

  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const {user} = useUserInfo();

  const {colors} = useAppTheme();

  const [isLoadingAvatar, setIsLoadingAvatar] = React.useState<boolean>(false);

  const mediaPicker = React.useRef<IPressHandler>(null);

  const [selectedImage, setSelectedImage] = React.useState<ISelectedMedia>();
  const [cropper, setCropper] = React.useState<boolean>(false);
  const [imageBase64, setImageBase64] = React.useState<string>('');
  const [filePath, setFilePath] = React.useState<string>('');

  const {uriArr2: fileExtension, filename: getFileName} = useMemo(
    () => getImageExtension(originalAvatar || ''),
    [originalAvatar],
  );

  const [profilePhoto, setProfilePic] = React.useState<string>(uriAvatar || '');
  const [oldProfilePhoto, setOldProfilePic] = React.useState<string>(
    uriAvatar || '',
  );

  const setProfilePicWithBackup = useCallback(
    (newPhoto: React.SetStateAction<string>) => {
      setOldProfilePic(profilePhoto);
      setProfilePic(newPhoto);
    },
    [profilePhoto],
  );

  const revertProfilePic = useCallback(() => {
    setOldProfilePic(oldProfilePhoto);
    setProfilePic(uriAvatar);
  }, [oldProfilePhoto, uriAvatar]);

  const updateProfilePhoto = useCallback(
    async (payload: ISelectFile) => {
      setProfilePicWithBackup(payload.croppedFile);
      setIsLoadingAvatar(true);
      try {
        const {status, data: resData} = await uploadProfile(payload);
        if (status === 200) {
          showSnackbar({message: 'Upload Successful', type: 'success'});
          let croppedDetails = {} as PicCroppedDetails;
          try {
            croppedDetails = JSON.parse(resData.imageViewAttribute);
          } catch (error) {
            console.log(error);
          }
          dispatch(
            updateProfilePic({
              croppedImageReadUrl: resData.croppedImageReadUrl,
              originalImageReadUrl: resData.originalImageReadUrl,
              croppedImageDetails: croppedDetails,
            }),
          );
          queryClient.invalidateQueries(QueryKeys.userProfile);
        }
        setIsLoadingAvatar(false);
      } catch (e) {
        console.log('in catch');
        setSelectedImage(undefined);
        setImageBase64('');
        setIsLoadingAvatar(false);
        revertProfilePic();
      }
    },
    [
      dispatch,
      queryClient,
      revertProfilePic,
      setProfilePicWithBackup,
      updateProfilePic,
    ],
  );

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
          maxSize!,
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
      updateProfilePhoto({...data, originalFile: selectedImage});
    } else {
      const selectImageObjects = {
        base64: `data:image/${fileExtension};base64,${imageBase64}`,
        name: getFileName,
        type: `image/${fileExtension}`,
        uri: filePath,
      };
      updateProfilePhoto({...data, originalFile: selectImageObjects});
    }
    setSelectedImage(undefined);
    setImageBase64('');
    setFilePath('');
  };

  const onPressAvatar = () => {
    Keyboard.dismiss();
    setIsLoadingAvatar(false);
    if (profilePhoto) {
      toggleCropper();
      convert();
    } else {
      mediaPicker.current?.onPickerSelect();
    }
  };

  const convert = useCallback(() => {
    try {
      const link = originalAvatar || '';
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
  }, [fileExtension, originalAvatar]);

  const handleError = () => {
    setIsLoadingAvatar(false);
    setCropper(false);
  };

  return (
    <View flex={1} p={2}>
      <View
        alignItems="center"
        flex={1}
        flexDirection="row"
        justifyContent="space-between">
        <Text>Photo</Text>
      </View>
      <View style={styles.center}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={[
            styles.avatarContainer,
            {
              // height,
              // width,
              // borderColor: colors.gray[900],
              backgroundColor: colors.gray[500],
            },
          ]}
          onPress={isLoadingAvatar ? undefined : onPressAvatar}>
          <ImageCropper
            enableZoom
            rounded
            allowGif={allowGif}
            aspectRatio={1}
            avatarMaxSize={AVATAR_MAX_SIZE}
            avatarViewAttribute={
              !selectedImage ? avatarViewAttribute : undefined
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
            selectFile={onSelectImage}
            validImageHeight={300}
            validImageWidth={300}
            onError={handleError}
          />
          {editable ? (
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.editIconContainer}
              onPress={() => {
                mediaPicker.current?.onPickerSelect();
              }}>
              <MaterialIcon name="edit" size={25} />
            </TouchableOpacity>
          ) : null}
          {uriAvatar ? (
            <Image source={{uri: uriAvatar}} style={styles.imgStyle} />
          ) : (
            <View>
              {subTitle ? (
                <Text color="black" style={[styles.textRating, {fontSize}]}>
                  {(user?.fullName || 'A').charAt(0).toUpperCase()}
                </Text>
              ) : null}
            </View>
          )}

          {isLoadingAvatar && (
            <View style={[StyleSheet.absoluteFill, styles.avatarLoaderView]}>
              <ActivityIndicator color={colors.black[400]} />
            </View>
          )}

          <MediaPicker
            options={{mediaType: 'photo', includeBase64: true}}
            ref={mediaPicker}
            validImageHeight={300}
            validImageWidth={300}
            onError={handleError}
            onSelectImage={onSelectImage}
          />

          {user?.influencerStatus && (
            <View bottom={0} position="absolute" right={0} zIndex={1122}>
              <InfluencerTickIcon height={16} width={16} />
            </View>
          )}
        </TouchableOpacity>
      </View>
      {uriAvatar && (
        <TouchableOpacity onPress={onPressAvatar}>
          {isLoadingAvatar ? (
            <View />
          ) : (
            <View alignItems="flex-start">
              <View borderBottomWidth={1}>
                <Text fontSize={12} fontWeight={500}>
                  Update Image
                </Text>
              </View>
            </View>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

Avatar.defaultProps = {
  subTitle: 'Upload Avatar',
  editable: false,
  fontSize: 15,
  allowGif: false,
  avatarViewAttribute: undefined,
  originalAvatar: '',
};

const styles = StyleSheet.create({
  textRating: {
    fontSize: 28,
    textAlign: 'center',
    lineHeight: 36,
  },
  center: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginVertical: 5,
  },
  avatarContainer: {
    position: 'relative',
    height: 70,
    width: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIconContainer: {
    position: 'absolute',
    right: 5,
    top: 10,
    zIndex: 9999,
  },
  imgStyle: {
    height: 70,
    width: 70,
    borderRadius: 35,
  },
  avatarLoaderView: {
    zIndex: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
