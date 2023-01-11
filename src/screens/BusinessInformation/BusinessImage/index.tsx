/**
 * @format
 */
import React from 'react';
import {ScrollView, Text, View} from 'native-base';
import isEqual from 'lodash.isequal';

import {RootStackScreenProps} from 'navigation/DrawerNav';
import {useAppTheme} from 'theme';
import {
  CommonImagePicker,
  ExtraInfoType,
  Button,
  HeaderLeft,
  HeaderTitle,
  SafeAreaContainer,
  Title,
  ISelectFile,
} from 'components';

import {ImageType, BusinessImageSelectionUI} from './component/ImgBox';
import {BusinessImages, IBusinessInfo, IImage} from '../useBusinessInfo';
import {useRemoveImage} from './useRemoveImage';
import {IUploadImage, useUploadImage} from './useUploadImage';
import {IBusinessImages} from '../useBusinessImages';

interface Props extends RootStackScreenProps<'BusinessInfo'> {
  businessInfo: IBusinessInfo | undefined;
  handleNext: () => void;
  handleBack: () => void;
}

interface IExtraInfo {
  documentId: string;
  type: ImageType;
}

export const initialValues: IBusinessImages = {
  background: {} as IImage,
  media: [],
  logo: {} as IImage,
};

function BusinessImage(props: Props) {
  const {navigation, businessInfo, route, handleNext, handleBack} = props;

  const [form, setForm] = React.useState<BusinessImages>(initialValues);
  const theme = useAppTheme();

  const from = route.params?.from;

  React.useLayoutEffect(() => {
    if (businessInfo?.images) {
      if (!isEqual(form, businessInfo.images)) {
        setForm(businessInfo.images);
      }
    }
  }, [businessInfo?.images, form]);

  React.useLayoutEffect(() => {
    const headerLeft = () => <HeaderLeft onPress={navigation.goBack} />;
    const headerTitle = () => <HeaderTitle title="Business Images" />;
    navigation.setOptions({
      headerShown: true,
      headerBackVisible: false,
      headerTitleAlign: 'center',
      headerTitle,
      headerLeft,
      headerRight: () => null,
    });
  }, [navigation]);

  const {tryRemoveImage, deleting, documentId: deletingId} = useRemoveImage();

  const {
    tryUploadImage,
    uploading,
    businessId: uploadingId,
    imageType: uploadType,
  } = useUploadImage();

  const onDelete = (info: ExtraInfoType) => {
    const {documentId, type} = info as unknown as IExtraInfo;
    if (documentId !== '') {
      tryRemoveImage({documentId, type});
    }
  };

  const onSelectFile = (fileInfo: ISelectFile, extraInfo: ExtraInfoType) => {
    const {documentId, type} = extraInfo as unknown as IExtraInfo;
    const uploadInfo: IUploadImage = {
      businessId: businessInfo?.documentId || '',
      imageId: documentId,
      imageType: type,
      fileInfo,
    };
    tryUploadImage(uploadInfo);
  };

  const {logo, media, background} = form;
  const fromProfile = from === 'profile';
  const canAddMedia = (media && media?.length) < 3;

  return (
    <SafeAreaContainer>
      <View flexGrow={1} pt={2} px={2}>
        {!fromProfile && (
          <View mb={5}>
            <Text
              alignSelf="center"
              color={theme.colors.maroon[900]}
              fontSize="md">
              Step 4 of 5
            </Text>
            <Text alignSelf="center" fontSize="sm" mt={2} textAlign="center">
              (Note:The images resolution must be 640 x 480 or higher.)
            </Text>
            <Text fontSize="md" mt={2} textAlign="center">
              Add images to your profile
            </Text>
          </View>
        )}
        <ScrollView>
          <View>
            <Title fontSize={18} fontWeight={600} mt={2}>
              Logo
            </Title>
            {logo ? (
              <CommonImagePicker
                editable
                deleting={deleting && deletingId === logo.documentId}
                extraInfo={{documentId: logo.documentId, type: 'logo'}}
                height={130}
                key="logo"
                originalImage={logo.originalImageReadUrl}
                renderSelectionUI={<BusinessImageSelectionUI />}
                selectFile={onSelectFile}
                size={75}
                subTitle="Add Image"
                uploading={
                  uploading &&
                  uploadingId === logo.documentId &&
                  uploadType === 'logo'
                }
                uriImage={logo.croppedImageReadUrl}
                width={150}
                onDelete={onDelete}
              />
            ) : null}

            <View mt={5}>
              <Title fontSize={18} fontWeight={600}>
                Background
              </Title>
            </View>
            <CommonImagePicker
              editable
              aspectRatio={16 / 9}
              deleting={deleting && deletingId === background.documentId}
              extraInfo={{
                documentId: background.documentId,
                type: 'background',
              }}
              height={130}
              key="background"
              originalImage={background.originalImageReadUrl}
              renderSelectionUI={<BusinessImageSelectionUI />}
              selectFile={onSelectFile}
              size={75}
              subTitle="Add Image"
              uploading={
                uploading &&
                uploadingId === background.documentId &&
                uploadType === 'background'
              }
              uriImage={background.croppedImageReadUrl}
              width="100%"
              onDelete={onDelete}
            />
          </View>
          <View mt={5}>
            <Title fontSize={18} fontWeight={600}>
              Media
            </Title>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {media?.map(c => {
                return (
                  <View key={`media-${c.documentId}`} mr={2}>
                    <CommonImagePicker
                      editable
                      deleting={deleting && deletingId === c.documentId}
                      extraInfo={{documentId: c.documentId, type: 'media'}}
                      height={90}
                      originalImage={c.originalImageReadUrl}
                      removable={media.length > 1}
                      renderSelectionUI={<BusinessImageSelectionUI />}
                      selectFile={onSelectFile}
                      size={75}
                      subTitle="Add Image"
                      uploading={
                        uploading &&
                        uploadingId === c.documentId &&
                        uploadType === 'media'
                      }
                      uriImage={c.croppedImageReadUrl}
                      width={118}
                      onDelete={onDelete}
                    />
                  </View>
                );
              })}
              {canAddMedia && (
                <CommonImagePicker
                  deleting={false}
                  extraInfo={{documentId: '', type: 'media'}}
                  height={90}
                  key="media-add"
                  originalImage={undefined}
                  renderSelectionUI={<BusinessImageSelectionUI />}
                  retainImage={false}
                  selectFile={onSelectFile}
                  size={75}
                  subTitle="Add Image"
                  uploading={uploading && uploadType === 'media'}
                  uriImage=""
                  width={118}
                />
              )}
            </ScrollView>
          </View>
        </ScrollView>
        <View
          alignItems="center"
          flexDirection="row"
          justifyContent="space-between"
          mb={2}>
          {!fromProfile && (
            <View alignItems="center" flex={1} justifyContent="center" mr={5}>
              <Button
                backgroundColor={theme.colors.transparent}
                borderColor={theme.colors.brand['600']}
                fontWeight="normal"
                mt={6}
                textColor={theme.colors.brand['600']}
                title="BACK"
                variant="outline"
                width="full"
                onPress={handleBack}
              />
            </View>
          )}
          {!fromProfile ? (
            <View alignItems="center" flex={1} justifyContent="center">
              <Button
                disabled={!(media?.length > 0 && logo && background)}
                fontWeight="normal"
                loadingText="Updating"
                mt={6}
                title="Next"
                width="full"
                onPress={handleNext}
              />
            </View>
          ) : null}
        </View>
      </View>
    </SafeAreaContainer>
  );
}

export default BusinessImage;
