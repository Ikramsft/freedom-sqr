/**
 * @format
 */
import React from 'react';
import {View, Text, Spinner} from 'native-base';

import {RootStackScreenProps} from 'navigation/DrawerNav';
import {useAppTheme} from 'theme';
import {
  SafeTouchable,
  HeaderLeft,
  SafeAreaContainer,
  Title,
} from 'components';

import {useForgotPassword} from './useForgotPassword';
import {Header} from '../Header';

function ForgotPasswordSuccess(
  props: RootStackScreenProps<'ForgotPasswordSuccess'>,
) {
  const {navigation, route} = props;

  const {email} = route.params;

  const theme = useAppTheme();
  const [loading, setLoading] = React.useState(false);

  const {tryForgotPassword} = useForgotPassword();

  const onSuccess = () => setLoading(false);

  const resendEmail = () => {
    setLoading(true);
    tryForgotPassword({email}, onSuccess);
  };

  return (
    <SafeAreaContainer edges={['top', 'bottom']}>
      <Header />
      <View alignItems="center" flex={1} justifyContent="space-around">
        <View left={6} position="absolute" top={4}>
          <HeaderLeft onPress={navigation.goBack} />
        </View>
        <View alignItems="center" justifyContent="center" width="100%">
          <Text fontSize={22} fontWeight="900">
            Check Your Email
          </Text>
          <Text fontSize={20} mt={5}>
            We've sent an email to
          </Text>
          <Text
            color={theme.colors.red[900]}
            fontSize={18}
            mb={5}>{`${email}`}</Text>
          <Text fontSize={18}>
            Click the link in email Reset your password.
          </Text>
          <Text fontSize={22} fontWeight="900" mb={5} mt={5}>
            Didn't get the email?
          </Text>
          <View
            alignItems="center"
            justifyContent="center"
            pointerEvents={loading ? 'none' : 'auto'}
            width="100%">
            <Text fontSize={18}>Check your spam folder or </Text>
            <SafeTouchable disabled={loading} onPress={resendEmail}>
              <Title color={theme.colors.red[900]}>Resend the email.</Title>
            </SafeTouchable>
            {loading && <Spinner />}
          </View>
        </View>
        <View />
      </View>
    </SafeAreaContainer>
  );
}

export default ForgotPasswordSuccess;
