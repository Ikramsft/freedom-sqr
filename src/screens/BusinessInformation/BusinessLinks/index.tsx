/**
 * @format
 */
import React from 'react';
import {Text, View} from 'native-base';

import {RootStackScreenProps} from 'navigation/DrawerNav';
import {useAppTheme} from 'theme';
import {
  Button,
  SafeTouchable,
  HeaderLeft,
  HeaderTitle,
} from 'components';

import {SocialLinks} from '../../../constants';
import {
  IBusinessLinksForm,
  useBusinessLinksForm,
} from '../useBusinessLinksForm';
import {useAddUpdateBusiness} from '../useAddUpdateBusiness';
import SocialLinkComponent from './SocialLinkComponent';
import {IBusinessInfo} from '../useBusinessInfo';
import {useCardHelper} from '../../Payments/useCardHelper';

interface Props extends RootStackScreenProps<'BusinessInfo'> {
  businessInfo: IBusinessInfo | undefined;
  handleNext: () => void;
  handleBack: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const generateSocialLinkParams = (data: any) => {
  const {facebook, instagram, linkedin, twitter, ...rest} = data;
  const socialLinks = [];
  if (facebook) {
    socialLinks.push({
      socialType: 'facebook',
      link: `${SocialLinks.facebook}${facebook}`,
    });
  }
  if (instagram) {
    socialLinks.push({
      socialType: 'instagram',
      link: `${SocialLinks.instagram}${instagram}`,
    });
  }
  if (linkedin) {
    socialLinks.push({
      socialType: 'linkedin',
      link: `${SocialLinks.linkedin}${linkedin}`,
    });
  }
  if (twitter) {
    socialLinks.push({
      socialType: 'twitter',
      link: `${SocialLinks.twitter}${twitter}`,
    });
  }
  const params = {...rest, socialLinks};
  return params;
};

function BusinessLinks(props: Props) {
  const {navigation, businessInfo, handleNext, handleBack} = props;

  const theme = useAppTheme();

  const {onFieldChange} = useCardHelper();

  React.useLayoutEffect(() => {
    const headerLeft = () => <HeaderLeft onPress={() => navigation.goBack} />;
    const headerTitle = () => <HeaderTitle title="Social Links" />;
    navigation.setOptions({
      headerShown: true,
      headerBackVisible: false,
      headerTitleAlign: 'center',
      headerTitle,
      headerLeft,
      headerRight: () => null,
    });
  }, [navigation]);
  const {tryAddUpdateBusinessLinks, isLoading: addingUpdating} =
    useAddUpdateBusiness();

  const onSuccess = (success: boolean) => {
    if (success) {
      handleNext();
    }
  };

  const initialValues: IBusinessLinksForm = {
    facebook: '',
    instagram: '',
    linkedin: '',
    twitter: '',
    documentId: '',
  };

  const onSubmit = (values: IBusinessLinksForm) => {
    const params = generateSocialLinkParams(values);
    params.documentId = businessInfo?.documentId || '';
    tryAddUpdateBusinessLinks({...params, callback: onSuccess});
  };

  const form = useBusinessLinksForm(initialValues);
  const {handleSubmit} = form;

  return (
    <View flexGrow={1} justifyContent="space-between" p={5}>
      <View>
        <Text alignSelf="center" color={theme.colors.maroon[900]} fontSize="md">
          Step 3 of 5
        </Text>
        <View mb={5}>
          <Text fontSize="md" mt={2} textAlign="center">
            Add the social links to feature on your profile.
          </Text>
        </View>
        <SocialLinkComponent form={form} onFieldChange={onFieldChange} />
      </View>
      <View>
        <View
          alignItems="center"
          alignSelf="flex-end"
          flexDirection="row"
          justifyContent="space-between"
          mb={5}>
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
              disabled={addingUpdating}
              fontWeight="normal"
              isLoading={addingUpdating}
              loadingText="Updating"
              mt={6}
              title="Next"
              width="full"
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </View>
        <SafeTouchable onPress={handleNext}>
          <View
            alignSelf="center"
            borderBottomColor={theme.colors.maroon[900]}
            borderBottomWidth={1}>
            <Text color={theme.colors.maroon[900]}>Skip this step</Text>
          </View>
        </SafeTouchable>
      </View>
    </View>
  );
}

export default BusinessLinks;
