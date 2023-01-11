import React from 'react';
import {View, Text, Spinner} from 'native-base';
import Feather from 'react-native-vector-icons/Feather';
import {Controller} from 'react-hook-form';

import {RootStackScreenProps} from 'navigation/DrawerNav';
import {useAppTheme} from 'theme';
import {
  TextField,
  Button,
  ScrollView,
  SafeTouchable,
  HeaderLeft,
  HeaderTitle,
  SafeAreaContainer,
  Title,
  SubTitle,
} from 'components';

import {IPassword, useResetForm, verifyEmailValidity} from './useResetForm';
import {useResendEmail} from '../Signup/useResendEmail';
import {useUpdatePassword} from '../../Profile/ChangePassword/useUpdatePassword';
import {ShowPasswordType} from '../Signup';

const initValues: IPassword = {
  password: '',
  confirmPassword: '',
};

function ResetPassword(props: RootStackScreenProps<'ResetPassword'>) {
  const {navigation, route} = props;
  const {token, email} = route.params;

  const [show, setShow] = React.useState({
    password: false,
    confirmPassword: false,
  });

  const theme = useAppTheme();
  const [loading, setLoading] = React.useState(false);

  const [tokenValidity, setTokenValidity] = React.useState({
    validating: false,
    valid: false,
  });

  const {tryResendResetEmail} = useResendEmail();

  const {tryResetPassword} = useUpdatePassword();

  const validateToken = React.useCallback(async () => {
    setTokenValidity({validating: true, valid: false});
    try {
      await verifyEmailValidity(token);
      setTokenValidity({validating: false, valid: true});
    } catch (err: any) {
      setTokenValidity({validating: false, valid: false});
    }
  }, [token]);

  React.useEffect(() => {
    if (token) {
      validateToken();
    }
  }, [token, validateToken]);

  const onResetSuccess = (success: boolean) => {
    setLoading(false);
    if (success) {
      navigation.navigate('Login');
    }
  };

  const onSubmit = (values: IPassword) => {
    setLoading(true);
    tryResetPassword({newPassword: values.password, token}, onResetSuccess);
  };

  const form = useResetForm(initValues);
  const {control, handleSubmit, formState} = form;
  const {errors, isDirty, isValid} = formState;

  const onBackPress = React.useCallback(
    () =>
      navigation.canGoBack()
        ? navigation.goBack()
        : navigation.replace('DrawerNav'),
    [navigation],
  );

  React.useLayoutEffect(() => {
    const headerLeft = () => <HeaderLeft onPress={onBackPress} />;
    const headerTitle = () => <HeaderTitle title="Reset Password" />;
    navigation.setOptions({
      headerShown: true,
      headerBackVisible: false,
      headerTitleAlign: 'center',
      headerTitle,
      headerLeft,
      headerRight: () => null,
    });
  }, [navigation, onBackPress]);

  const onSuccess = (success: boolean) => {
    setLoading(false);
    if (success) {
      navigation.navigate('Login');
    }
  };

  const resendResetEmail = () => {
    setLoading(true);
    tryResendResetEmail({email: decodeURIComponent(email)}, onSuccess);
  };

  if (tokenValidity.validating) {
    return (
      <SafeAreaContainer>
        <Spinner />
      </SafeAreaContainer>
    );
  }

  const togglePasswordView = (type: ShowPasswordType) => () => {
    if (type === 'Password') {
      setShow(s => ({...s, password: !s.password}));
    } else if (type === 'ConfirmPassword') {
      setShow(s => ({...s, confirmPassword: !s.confirmPassword}));
    }
  };

  return (
    <SafeAreaContainer>
      <ScrollView>
        {tokenValidity.valid ? (
          <View p={5}>
            <SubTitle alignSelf="center">Please enter a New Password</SubTitle>
            <View width="100%">
              <Controller
                control={control}
                name="password"
                render={({field: {onChange, onBlur, value}}) => (
                  <TextField
                    backgroundColor={theme.colors.white[800]}
                    borderRadius={5}
                    caretHidden={false}
                    error={
                      errors.password ? errors.password.message : undefined
                    }
                    label="Password"
                    maxLength={128}
                    pl={2}
                    placeholderTextColor={theme.colors.black[900]}
                    returnKeyType="next"
                    rightElement={
                      <SafeTouchable onPress={togglePasswordView('Password')}>
                        <View mr={2}>
                          <Feather
                            name={show.password ? 'eye' : 'eye-off'}
                            size={20}
                          />
                        </View>
                      </SafeTouchable>
                    }
                    secureTextEntry={!show.password}
                    size="lg"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>
            <View width="100%">
              <Controller
                control={control}
                name="confirmPassword"
                render={({field: {onChange, onBlur, value}}) => (
                  <TextField
                    backgroundColor={theme.colors.white[800]}
                    borderRadius={5}
                    caretHidden={false}
                    error={
                      errors.confirmPassword
                        ? errors.confirmPassword.message
                        : undefined
                    }
                    label="Confirm Password"
                    maxLength={128}
                    pl={2}
                    placeholderTextColor={theme.colors.black[900]}
                    returnKeyType="next"
                    rightElement={
                      <SafeTouchable
                        onPress={togglePasswordView('ConfirmPassword')}>
                        <View mr={2}>
                          <Feather
                            name={show.confirmPassword ? 'eye' : 'eye-off'}
                            size={20}
                          />
                        </View>
                      </SafeTouchable>
                    }
                    secureTextEntry={!show.confirmPassword}
                    size="lg"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>

            <Button
              alignSelf="center"
              disabled={!(isValid && isDirty) || loading}
              loading={loading}
              loadingText="Changing Password"
              mt={6}
              title="CHANGE PASSWORD"
              width="100%"
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        ) : (
          <View mt={3} mx={6}>
            <Title>
              Reset Password link has expired. Please request a new link email.
            </Title>
            <View alignSelf="center" flexDirection="row" mt={4}>
              <Text>Click here to </Text>
              <SafeTouchable disabled={loading} onPress={resendResetEmail}>
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

export default ResetPassword;
