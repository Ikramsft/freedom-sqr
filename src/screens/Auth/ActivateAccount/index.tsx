/**
 * @format
 */
import React from 'react';
import {View, Text, Spinner} from 'native-base';

import {RootStackScreenProps} from 'navigation/DrawerNav';
import {useAppTheme} from 'theme';
import {
  ScrollView,
  SafeTouchable,
  HeaderLeft,
  HeaderTitle,
  SafeAreaContainer,
  Title,
} from 'components';

import {useResendEmail} from '../Signup/useResendEmail';
import {
  verifyEmailValidity,
  verifyTokenValidity,
} from '../ResetPassword/useResetForm';

function ActivateAccount(props: RootStackScreenProps<'ActivateAccount'>) {
  const {navigation, route} = props;
  const {token, email} = route.params;

  const theme = useAppTheme();
  const [loading, setLoading] = React.useState(false);

  const [tokenValidity, setTokenValidity] = React.useState({
    validating: false,
    valid: false,
  });

  const {tryResendVerificationEmail} = useResendEmail();

  const validateEmail = React.useCallback(async () => {
    setTokenValidity({validating: true, valid: false});
    try {
      await verifyTokenValidity(token);
      await verifyEmailValidity(token);
      setTokenValidity({validating: false, valid: true});
      const tm = setTimeout(() => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          navigation.replace('DrawerNav');
        }
        const decodedEmail = decodeURIComponent(email);
        navigation.navigate('Login', {email: decodedEmail});
        clearTimeout(tm);
      }, 3000);
    } catch (err: any) {
      setTokenValidity({validating: false, valid: false});
    }
  }, [email, navigation, token]);

  React.useEffect(() => {
    if (token) {
      validateEmail();
    }
  }, [token, validateEmail]);

  React.useLayoutEffect(() => {
    const onBackPress = () =>
      navigation.canGoBack()
        ? navigation.goBack()
        : navigation.replace('DrawerNav');

    const headerLeft = () => <HeaderLeft onPress={onBackPress} />;
    const headerTitle = () => <HeaderTitle title="Email Verification" />;
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

  const resendActivateEmail = () => {
    setLoading(true);
    tryResendVerificationEmail({email: decodeURIComponent(email)}, onSuccess);
  };

  return (
    <SafeAreaContainer>
      <ScrollView>
        {tokenValidity.validating ? (
          <>
            <Title alignSelf="center">Verifying Email</Title>
            <Spinner />
          </>
        ) : tokenValidity.valid ? (
          <View p={5}>
            <Title alignSelf="center" textAlign="center">
              {`Your Email has been Verified! \n Redirecting to login...`}
            </Title>
          </View>
        ) : (
          <View mt={3} mx={6}>
            <Title>
              Email Verification link has expired. Please request a new link
              email.
            </Title>
            <View alignSelf="center" flexDirection="row" mt={4}>
              <Text>Click here to </Text>
              <SafeTouchable disabled={loading} onPress={resendActivateEmail}>
                <Title color={theme.colors.red[900]}>Resend the email.</Title>
              </SafeTouchable>
              {loading && <Spinner />}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaContainer>
  );
}

export default ActivateAccount;
