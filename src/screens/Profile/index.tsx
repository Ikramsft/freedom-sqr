/**
 * @format
 */
import React from 'react';
import {View} from 'native-base';

import {useAppTheme} from 'theme';
import {Button, ScrollView, Header, SafeAreaContainer} from 'components';

import {ContentType, ProfileItem} from './ProfileItem';
import {
  useBusinessInfo,
  IBusinessInfo,
  BusinessSetupStatus,
  BusinessSteps,
} from '../BusinessInformation/useBusinessInfo';
import {openInAppBrowser} from '../../utils';
import {CORE_VALUES_WEB_URL, POLICY_WEB_URL, TERMS_WEB_URL} from '../../config';
import {DrawerNavProps} from '../../navigation/DrawerNav';
import {useUserLogout} from '../../redux/user/useUserLogout';
import {useRefetchOnFocus} from '../../hooks/useRefetchOnFocus';
import {useUserInfo} from '../../hooks/useUserInfo';

const profileContent: ContentType[] = [
  {id: '5', title: 'PROFILE', label: 'Edit Profile'},
  {id: '0', title: 'PAYMENT', label: 'Payment'},
  {id: '1', title: 'AFFILIATE', label: 'Affiliate'},
  {id: '2', title: 'PREFERENCES', label: 'Preferences'},
];

const termsPolicy: ContentType[] = [
  {id: '1', title: 'TERMS', label: 'Terms & Condition'},
  {id: '2', title: 'PRIVACY', label: 'Privacy Policy'},
  {id: '3', title: 'CORE_VALUES', label: 'Core Values'},
];

type Props = DrawerNavProps<'Profile'>;

function Profile(props: Props) {
  const {navigation} = props;
  const theme = useAppTheme();

  const {authenticated: isLoggedIn} = useUserInfo();

  const {tryLogoutUser} = useUserLogout();

  const {
    data: businessDetails = {} as IBusinessInfo,
    isLoading,
    refetch,
  } = useBusinessInfo(isLoggedIn);

  useRefetchOnFocus(refetch, true);

  const goToDetail = (section: ContentType) => {
    if (section.title === 'PREFERENCES') {
      navigation.navigate('DrawerNav', {screen: 'Following'});
    } else {
      navigation.push('UpdateProfileContent', {content: section});
    }
  };

  const openTermsPolicy = (section: ContentType) => {
    if (section.title === 'TERMS') {
      openInAppBrowser(TERMS_WEB_URL);
    } else if (section.title === 'PRIVACY') {
      openInAppBrowser(POLICY_WEB_URL);
    } else if (section.title === 'CORE_VALUES') {
      openInAppBrowser(CORE_VALUES_WEB_URL);
    }
  };

  const goToBusinessDetail = (section: ContentType) => {
    navigation.push('BusinessInfo', {
      content: section,
      from: 'profile',
      step: BusinessSteps.BUSINESS_INFO,
    });
  };

  const goToBusinessImages = () => {
    navigation.push('BusinessInfo', {
      from: 'profile',
      step: BusinessSteps.BUSINESS_IMAGES,
    });
  };

  const goToBusinessDetailsForm = () => {
    navigation.push('BusinessInfo', {
      from: 'profile',
      step: BusinessSteps.BUSINESS_DETAILS,
    });
  };

  const showBusiness =
    Object.keys(businessDetails).length > 0 &&
    businessDetails.status === BusinessSetupStatus.APPROVED &&
    businessDetails.step === BusinessSteps.COMPLETED;

  return (
    <SafeAreaContainer edges={['top', 'bottom']}>
      <Header />
      <ScrollView keyboardShouldPersistTaps="always">
        <View bg={theme.colors.white[900]} p={5}>
          {profileContent.map(c => (
            <ProfileItem
              item={c}
              key={c.title}
              theme={theme}
              onPress={goToDetail}
            />
          ))}
          {showBusiness ? (
            <ProfileItem
              arrow={false}
              disabled={isLoading}
              item={{id: '55', title: 'BUSINESS', label: 'Business'}}
              key="BUSINESS"
              renderBottom={
                <View pl={4}>
                  <ProfileItem
                    bottomBorder={false}
                    item={{
                      id: '551',
                      title: 'INFORMATION',
                      label: 'Information',
                    }}
                    theme={theme}
                    onPress={goToBusinessDetail}
                  />
                  <ProfileItem
                    bottomBorder={false}
                    item={{
                      id: '551',
                      title: 'INFORMATION',
                      label: 'Description',
                    }}
                    theme={theme}
                    onPress={goToBusinessDetailsForm}
                  />
                  <ProfileItem
                    bottomBorder={false}
                    item={{id: '551', title: 'IMAGES', label: 'Media'}}
                    theme={theme}
                    onPress={goToBusinessImages}
                  />
                </View>
              }
              theme={theme}
            />
          ) : null}
          {termsPolicy.map(c => (
            <ProfileItem
              item={c}
              key={c.title}
              theme={theme}
              onPress={openTermsPolicy}
            />
          ))}
        </View>
        <Button
          mx={5}
          testID="ProfileLogoutButton"
          title="Logout"
          onPress={tryLogoutUser}
        />
      </ScrollView>
    </SafeAreaContainer>
  );
}

export default Profile;
