/**
 * @format
 */
import React from 'react';
import {View, Text} from 'native-base';
import Feather from 'react-native-vector-icons/Feather';
import {Controller} from 'react-hook-form';

import {RootStackScreenProps} from 'navigation/DrawerNav';
import {useAppTheme} from 'theme';
import {
  TextField,
  SafeTouchable,
  Button,
  ScrollView,
  HeaderLeft,
  SafeAreaContainer,
} from 'components';

import {ILogin, useLoginForm} from './useLoginForm';
import {LoginCallbackParams, useUserLogin} from './useUserLogin';
import {Header} from '../Header';

function Login(props: RootStackScreenProps<'Login'>) {
  const {navigation, route} = props;

  const theme = useAppTheme();
  const [loading, setLoading] = React.useState(false);
  const [show, setShow] = React.useState(false);

  const {tryLogin} = useUserLogin();

  const onLoginSuccess = (params?: LoginCallbackParams) => {
    const {success, redirectToBusiness, redirectToVerify, values} =
      params || {};
    setLoading(false);
    if (redirectToVerify) {
      navigation.navigate('SignupSuccess', {email: values?.email || ''});
      return;
    }
    if (success) {
      navigation.navigate('Home');

      if (redirectToBusiness) {
        navigation.navigate('BusinessInfo', {
          content: {id: '', title: 'INFORMATION', label: 'Information'},
        });
      }
    }
  };

  const onSubmit = (values: ILogin) => {
    setLoading(true);
    tryLogin(values, onLoginSuccess);
  };

  const initialValues: ILogin = {
    email: route?.params?.email ?? '',
    password: '',
  };

  const form = useLoginForm(initialValues);
  const {control, handleSubmit, formState} = form;
  const {errors, isValid} = formState;

  const handleForgotPassword = () => navigation.navigate('ForgotPassword');

  const goSignup = () => navigation.navigate('Signup');

  const goToHome = () => navigation.navigate('Home');

  const togglePasswordView = () => setShow(s => !s);

  return (
    <SafeAreaContainer edges={['top', 'bottom']}>
      <ScrollView pointerEvents={loading ? 'none' : 'auto'}>
        <Header onPress={goToHome} />
        <View pt={16} px={6}>
          <View left={6} position="absolute" top={4}>
            <HeaderLeft onPress={navigation.goBack} />
          </View>
          <Text alignSelf="center" fontSize={18} fontWeight="bold" mb={3}>
            Welcome Back
          </Text>
          <View width="100%">
            <Controller
              control={control}
              name="email"
              render={({field: {onChange, onBlur, value}}) => (
                <TextField
                  autoCapitalize="none"
                  autoComplete="email"
                  caretHidden={false}
                  error={errors.email ? errors.email.message : undefined}
                  keyboardType="email-address"
                  label="Email"
                  placeholder="Email"
                  returnKeyType="next"
                  testID="email"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                />
              )}
              rules={{required: true}}
            />
          </View>
          <View width="100%">
            <Controller
              control={control}
              name="password"
              render={({field: {onChange, onBlur, value}}) => (
                <TextField
                  autoCapitalize="none"
                  autoComplete="password"
                  caretHidden={false}
                  error={errors.password ? errors.password.message : undefined}
                  label="Password"
                  placeholder="Password"
                  returnKeyType="next"
                  rightElement={
                    <SafeTouchable onPress={togglePasswordView}>
                      <View mr={2}>
                        <Feather name={show ? 'eye' : 'eye-off'} size={20} />
                      </View>
                    </SafeTouchable>
                  }
                  secureTextEntry={!show}
                  testID="password"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                />
              )}
              rules={{required: true}}
            />
          </View>
          <View alignSelf="flex-end" mt={5}>
            <SafeTouchable
              testID="forgot-password-button"
              onPress={handleForgotPassword}>
              <Text
                color={theme.colors.maroon[900]}
                fontSize={14}
                fontWeight="bold">
                Forgot Password?
              </Text>
            </SafeTouchable>
          </View>
          <Button
            disabled={!isValid}
            loading={loading}
            loadingText="Logging In"
            mt={6}
            testID="sign-in-button"
            title={'Sign In to Freedom Square'.toUpperCase()}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
        <View
          alignItems="center"
          flexDirection="row"
          justifyContent="center"
          mt={6}>
          <Text fontSize={14} fontWeight="400" mr={2}>
            Don't have an account?
          </Text>
          <View
            borderBottomColor={theme.colors.maroon[900]}
            borderBottomWidth={1}>
            <SafeTouchable onPress={goSignup}>
              <Text
                color={theme.colors.maroon[900]}
                fontSize={14}
                fontWeight="bold">
                Sign Up Now
              </Text>
            </SafeTouchable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaContainer>
  );
}

export default Login;
