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
  HeaderTitle,
  SafeAreaContainer,
  Title,
} from 'components';

import {useResendEmail} from './useResendEmail';

function SignupSuccess(props: RootStackScreenProps<'SignupSuccess'>) {
  const {navigation, route} = props;

  const {email} = route.params;

  const theme = useAppTheme();
  const [loading, setLoading] = React.useState(false);

  const {tryResendVerificationEmail} = useResendEmail();

  React.useLayoutEffect(() => {
    const headerLeft = () => <HeaderLeft onPress={navigation.goBack} />;
    const headerTitle = () => <HeaderTitle title="" />;
    navigation.setOptions({
      headerShown: true,
      headerBackVisible: false,
      headerTitleAlign: 'center',
      headerTitle,
      headerLeft,
      headerRight: () => null,
    });
  }, [navigation]);

  const onSuccess = () => setLoading(false);

  const resendEmail = () => {
    setLoading(true);
    tryResendVerificationEmail({email}, onSuccess);
  };

  React.useEffect(() => {
    resendEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaContainer>
      <View mt={2}>
        <Title alignSelf="center" fontSize="2xl">
          Check your email
        </Title>
        <View alignSelf="center" flexDirection="row" mt={2}>
          <Text>We've sent an email to </Text>
          <Text color={theme.colors.red[900]} fontWeight="bold">
            {email}
          </Text>
        </View>
        <Text alignSelf="center" fontSize="lg" mt={2} px={2}>
          Click the link in email to confirm and continue creating your account
        </Text>
        <View alignSelf="center">
          <Title fontSize="2xl" fontWeight="900" mb={5} mt={5}>
            Didn't get the email?
          </Title>
        </View>
        <View alignSelf="center" flexDirection="row" mt={2}>
          <Text>Check your spam folder or </Text>
          <SafeTouchable disabled={loading} onPress={resendEmail}>
            <Title color={theme.colors.red[900]}>Resend the email.</Title>
          </SafeTouchable>
          {loading && <Spinner />}
        </View>
      </View>
    </SafeAreaContainer>
  );
}

export default SignupSuccess;
