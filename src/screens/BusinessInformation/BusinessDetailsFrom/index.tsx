/**
 * @format
 */
import React, {useMemo, useState} from 'react';
import {Divider, Text, View} from 'native-base';
import {StyleSheet} from 'react-native';
import {Controller} from 'react-hook-form';

import {RootStackScreenProps} from 'navigation/DrawerNav';
import {useAppTheme} from 'theme';
import {
  TextField,
  Button,
  ScrollView,
  HeaderLeft,
  HeaderTitle,
  Title,
} from 'components';

import {
  IBusinessDetailForm,
  useBusinessDetailForm,
} from '../useBusinessDetailForm';
import {useAddUpdateBusiness} from '../useAddUpdateBusiness';
import {generateSocialLinkParams} from '../BusinessLinks';
import {IBusinessInfo} from '../useBusinessInfo';
import {useCardHelper} from '../../Payments/useCardHelper';
import {SocialLinks} from '../../../constants';

interface Props extends RootStackScreenProps<'BusinessInfo'> {
  businessInfo: IBusinessInfo | undefined;
  handleNext: () => void;
  handleBack: () => void;
}

function BusinessDetailsForm(props: Props) {
  const {navigation, businessInfo, route, handleNext, handleBack} = props;
  const {from} = route.params || {};
  const fromProfile = from === 'profile';

  const theme = useAppTheme();

  const [addingUpdating, setAddingUpdating] = useState(false);

  const {tryAddUpdateBusinessDetails} = useAddUpdateBusiness();
  const {onFieldChange} = useCardHelper();

  const onSuccess = (success: boolean) => {
    setAddingUpdating(false);
    if (success) {
      handleNext();
    }
  };
  const onSubmit = (values: IBusinessDetailForm) => {
    if (isDirty) {
      values.documentId = businessInfo?.documentId || '';
      setAddingUpdating(true);
      tryAddUpdateBusinessDetails({
        ...generateSocialLinkParams(values),
        isUpdate: fromProfile,
        callback: onSuccess,
      });
    } else {
      onSuccess(true);
    }
  };

  const initialValues = useMemo(() => {
    const data = {
      tagline: businessInfo?.tagline || '',
      description: businessInfo?.description || '',
      documentId: businessInfo?.documentId || '',
    };

    businessInfo?.socialLinks?.map((link: any) => {
      const splited = link.link.split('/');
      const username = splited.splice(3).join('/');
      data[link.socialType as keyof typeof data] = username.replace('in/', '');
      return link;
    });

    return data;
  }, [businessInfo]);

  const form = useBusinessDetailForm(initialValues);
  const {control, handleSubmit, formState} = form;
  const {errors, isDirty, isValid} = formState;

  React.useLayoutEffect(() => {
    const headerLeft = () => <HeaderLeft onPress={navigation.goBack} />;
    const headerTitle = () => <HeaderTitle title="Business Details" />;
    navigation.setOptions({
      headerShown: true,
      headerBackVisible: false,
      headerTitleAlign: 'center',
      headerTitle,
      headerLeft,
      headerRight: () => null,
    });
  }, [navigation]);

  return (
    <View flexGrow={1} p={5}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <View flexGrow={1} justifyContent="space-between">
          <View>
            {!fromProfile ? (
              <View mb={5}>
                <Text
                  alignSelf="center"
                  color={theme.colors.maroon[900]}
                  fontSize="md">
                  Step 2 of 5
                </Text>
                <Text fontSize="md" mt={2} textAlign="center">
                  Set the tagline and description for your business profile .
                </Text>
              </View>
            ) : null}
            <View width="100%">
              <Controller
                control={control}
                name="tagline"
                render={({field: {onChange, onBlur, value}}) => (
                  <TextField
                    showCount
                    error={errors.tagline ? errors.tagline.message : undefined}
                    label="Tagline"
                    maxLength={100}
                    returnKeyType="next"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onFieldChange(onChange)}
                  />
                )}
                rules={{required: true, minLength: 20, maxLength: 100}}
              />
            </View>
            <View width="100%">
              <Controller
                control={control}
                name="description"
                render={({field: {onChange, onBlur, value}}) => (
                  <TextField
                    multiline
                    showCount
                    error={
                      errors.description
                        ? errors.description.message
                        : undefined
                    }
                    label="Description"
                    maxLength={1000}
                    numberOfLines={5}
                    textAlignVertical="top"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onFieldChange(onChange)}
                  />
                )}
                rules={{required: true, minLength: 100, maxLength: 1000}}
              />
            </View>
            {fromProfile ? (
              <>
                <Divider backgroundColor={theme.colors.gray[300]} mt={3} />
                <View mb={1} mt={1}>
                  <Title
                    color={theme.colors.black[900]}
                    fontSize={18}
                    fontWeight="bold"
                    textAlign="left">
                    Social Links
                  </Title>
                </View>
                <View mb={3} width="100%">
                  <Controller
                    control={control}
                    name="facebook"
                    render={({field: {onChange, onBlur, value}}) => (
                      <TextField
                        autoCapitalize="none"
                        label="Facebook URL"
                        leftElement={<Text ml={2}>{SocialLinks.facebook}</Text>}
                        placeholder="Username"
                        returnKeyType="next"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onFieldChange(onChange)}
                      />
                    )}
                  />
                </View>
                <View mb={3} width="100%">
                  <Controller
                    control={control}
                    name="instagram"
                    render={({field: {onChange, onBlur, value}}) => (
                      <TextField
                        autoCapitalize="none"
                        label="Instagram URL"
                        leftElement={
                          <Text ml={2}>{SocialLinks.instagram}</Text>
                        }
                        placeholder="Username"
                        returnKeyType="next"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onFieldChange(onChange)}
                      />
                    )}
                  />
                </View>
                <View mb={3} width="100%">
                  <Controller
                    control={control}
                    name="linkedin"
                    render={({field: {onChange, onBlur, value}}) => (
                      <TextField
                        autoCapitalize="none"
                        label="Linkedin URL"
                        leftElement={<Text ml={2}>{SocialLinks.linkedin}</Text>}
                        placeholder="Username"
                        returnKeyType="next"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onFieldChange(onChange)}
                      />
                    )}
                  />
                </View>
                <Controller
                  control={control}
                  name="twitter"
                  render={({field: {onChange, onBlur, value}}) => (
                    <TextField
                      autoCapitalize="none"
                      label="Twitter URL"
                      leftElement={<Text ml={2}>{SocialLinks.twitter}</Text>}
                      placeholder="Username"
                      returnKeyType="next"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onFieldChange(onChange)}
                    />
                  )}
                />
              </>
            ) : null}
          </View>
          <View
            alignItems="center"
            flexDirection="row"
            justifyContent="space-between">
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
            <View alignItems="center" flex={1} justifyContent="center">
              <Button
                disabled={
                  fromProfile
                    ? !(isDirty && isValid)
                    : !isValid || addingUpdating
                }
                fontWeight="normal"
                isLoading={addingUpdating}
                loadingText="Updating"
                mt={6}
                title={fromProfile ? 'SAVE' : 'NEXT'}
                width="full"
                onPress={handleSubmit(onSubmit)}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },
});

export default BusinessDetailsForm;
