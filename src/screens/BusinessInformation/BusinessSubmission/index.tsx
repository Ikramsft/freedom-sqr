/**
 * @format
 */
import React from 'react';
import {View} from 'native-base';

import {RootStackScreenProps} from 'navigation/DrawerNav';
import {
  Button,
  HeaderTitle,
  SafeAreaContainer,
  Title,
  SubTitle,
} from 'components';

interface Props extends RootStackScreenProps<'BusinessInfo'> {
  isSetupCompleted: boolean;
}

function BusinessSubmission(props: Props) {
  const {navigation, isSetupCompleted} = props;

  React.useLayoutEffect(() => {
    const headerLeft = () => null;
    const headerTitle = () => <HeaderTitle title="Submission" />;
    navigation.setOptions({
      headerShown: true,
      headerBackVisible: false,
      headerTitleAlign: 'center',
      headerTitle,
      headerLeft,
      headerRight: () => null,
    });
  }, [navigation]);

  const gotoHome = () => navigation.navigate('DrawerNav');

  if (isSetupCompleted) {
    return (
      <SafeAreaContainer>
        <View alignItems="center" mt={4} p={4} px={6}>
          <SubTitle my={2} textAlign="center">
            Business already exists in your account
          </SubTitle>
        </View>
        <View mb={2} pt={2} px={4}>
          <Button
            alignSelf="center"
            title="OK"
            width="50%"
            onPress={gotoHome}
          />
        </View>
      </SafeAreaContainer>
    );
  }

  return (
    <SafeAreaContainer>
      <View alignItems="center" mt={4} p={4} px={6}>
        <Title fontSize="xl">Business Account Submission</Title>
        <SubTitle fontWeight="bold" my={2} textAlign="center">
          Payment Processing
        </SubTitle>
        <SubTitle my={2} textAlign="center">
          For security purpose, your Business account is pending review by our
          staff before being activated.{' '}
        </SubTitle>
        <SubTitle fontWeight="bold" my={2} textAlign="center">
          You will receive email confirmation of payment
        </SubTitle>
        <SubTitle mt={2} textAlign="center">
          Please note, we may contact you for additional details and your
          payment will not be processed until approval.
        </SubTitle>
      </View>
      <View mb={2} pt={2} px={4}>
        <Button alignSelf="center" title="OK" width="50%" onPress={gotoHome} />
      </View>
    </SafeAreaContainer>
  );
}

export default BusinessSubmission;
