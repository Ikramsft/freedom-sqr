/**
 * @format
 */
import React from 'react';
import {View, Text, Switch, Spinner} from 'native-base';
import Feather from 'react-native-vector-icons/Feather';

import {RootStackScreenProps} from 'navigation/DrawerNav';
import {useAppTheme} from 'theme';
import {
  TextField,
  Button,
  ScrollView,
  SafeTouchable,
  HeaderLeft,
  Checkbox,
  SafeAreaContainer,
  Title,
} from 'components';
import {Controller} from 'react-hook-form';

import {ISignup, useSignupForm} from './useSignupForm';
import {ISignupRequest, useUserSignup} from './useUserSignup';
import {openInAppBrowser} from '../../../utils';
import {Header} from '../Header';
import {UserType} from '../../../redux/user/userInterface';
import {POLICY_WEB_URL, TERMS_WEB_URL} from '../../../config';
import ErrorMessages from '../../../constants/ErrorMessages';
import {useCardHelper} from '../../Payments/useCardHelper';

import {useAffiliateActions} from '../../../screens/CheckAffiliate/useAffiliateActions';
import {useUserInfo} from '../../../hooks/useUserInfo';

export type ShowPasswordType =
  | 'CurrentPassword'
  | 'Password'
  | 'ConfirmPassword';

function Signup(props: RootStackScreenProps<'Signup'>) {
  const {navigation, route} = props;

  const affiliateId = route.params?.affiliateId;

  const {authenticated: isLoggedIn} = useUserInfo();

  const {setAffiliateDataInStorage, getAffiliateStorageInfo} =
    useAffiliateActions();

  React.useEffect(() => {
    if (isLoggedIn && affiliateId) {
      navigation.replace('CheckAffiliate', {affiliateId});
    } else if (affiliateId) {
      setAffiliateDataInStorage(affiliateId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const theme = useAppTheme();
  const [loading, setLoading] = React.useState(false);

  const [show, setShow] = React.useState({
    password: false,
    confirmPassword: false,
  });

  const {tryRegister, tryCheckUserExists} = useUserSignup();

  const onSuccess = (success: boolean) => {
    setLoading(false);
    if (success) {
      navigation.replace('SignupSuccess', {email: getValues('email')});
    }
  };

  const onSubmit = async (v: ISignup) => {
    setLoading(true);

    const {affiliateId: storeId, isAffiliate} = getAffiliateStorageInfo();

    const values: ISignupRequest = {...v};
    if (isAffiliate) {
      values.affiliateUserId = storeId;
    }

    const email = encodeURIComponent(values.email ?? '');
    const userName = encodeURIComponent(values.userName ?? '');
    const query = `email=${email}&userName=${userName}`;
    const exists = await tryCheckUserExists(query);
    const {emailExists, userNameExists} = exists;
    if (!emailExists && !userNameExists) {
      tryRegister(values, onSuccess);
    } else {
      setLoading(false);
      if (emailExists) {
        setError('email', {message: ErrorMessages.signup.emailExists});
      }
      if (userNameExists) {
        setError('userName', {message: ErrorMessages.signup.userNameExists});
      }
    }
  };

  const {onFieldChange} = useCardHelper();

  const form = useSignupForm();
  const {control, handleSubmit, formState, setError, setValue, getValues} =
    form;
  const {errors, isDirty, isValid} = formState;

  const goLogin = () => navigation.navigate('Login');

  const toggleAccountType = (value: boolean) => {
    const updValue: UserType = value ? 'business' : 'individual';
    setValue('userType', updValue);
  };

  const togglePasswordView = (type: ShowPasswordType) => () => {
    if (type === 'Password') {
      setShow(s => ({...s, password: !s.password}));
    } else if (type === 'ConfirmPassword') {
      setShow(s => ({...s, confirmPassword: !s.confirmPassword}));
    }
  };

  const openTermsCondition = () => openInAppBrowser(TERMS_WEB_URL);

  const openPrivacyPolicy = () => openInAppBrowser(POLICY_WEB_URL);

  const goToHome = () => navigation.navigate('Home');

  if (isLoggedIn) {
    return (
      <SafeAreaContainer edges={['top', 'bottom']}>
        <Spinner />
      </SafeAreaContainer>
    );
  }

  return (
    <SafeAreaContainer edges={['top', 'bottom']}>
      <ScrollView pointerEvents={loading ? 'none' : 'auto'}>
        <Header onPress={goToHome} />
        <View pt={8} px={6}>
          <View left={6} position="absolute" top={4}>
            <HeaderLeft onPress={navigation.goBack} />
          </View>
          <Title alignSelf="center" fontSize="2xl" lineHeight={30} mt={6}>
            Join Freedom Square
          </Title>
          <Text
            alignSelf="center"
            color="gray.600"
            fontSize={14}
            fontWeight="bold"
            mt={4}
            textAlign="center">
            Explore great features and meet your new community
          </Text>
          <View>
            <View
              alignItems="center"
              flexDirection="row"
              justifyContent="space-around"
              mb={2}
              mt={4}>
              <Controller
                control={control}
                name="userType"
                render={({field: {value}}) => (
                  <>
                    <View borderBottomWidth={value === 'business' ? 0 : 1}>
                      <Text fontSize={14} fontWeight="normal">
                        Personal Account
                      </Text>
                    </View>
                    <Switch
                      isChecked={value === 'business'}
                      onTrackColor={theme.colors.maroon[900]}
                      onValueChange={toggleAccountType}
                    />
                    <View borderBottomWidth={value === 'business' ? 1 : 0}>
                      <Text fontSize={14} fontWeight="normal">
                        Business Account
                      </Text>
                    </View>
                  </>
                )}
                rules={{required: true}}
              />
            </View>
          </View>
          <Controller
            control={control}
            name="email"
            render={({field: {onChange, onBlur, value}}) => (
              <TextField
                autoCapitalize="none"
                autoComplete="email"
                error={errors.email ? errors.email.message : undefined}
                keyboardType="email-address"
                label="Email"
                placeholder="Enter your email address"
                returnKeyType="next"
                value={value}
                onBlur={onBlur}
                onChangeText={onFieldChange(onChange)}
              />
            )}
            rules={{required: true}}
          />
          <Controller
            control={control}
            name="userName"
            render={({field: {onChange, onBlur, value}}) => (
              <TextField
                autoCapitalize="none"
                autoComplete="username"
                error={errors.userName ? errors.userName.message : undefined}
                label="Username"
                maxLength={75}
                placeholder="Create your username"
                returnKeyType="next"
                value={value}
                onBlur={onBlur}
                onChangeText={onFieldChange(onChange)}
              />
            )}
            rules={{required: true, minLength: 4, maxLength: 75}}
          />
          <View flexDirection="row" justifyContent="space-between">
            <View width="48%">
              <Controller
                control={control}
                name="password"
                render={({field: {onChange, onBlur, value}}) => (
                  <TextField
                    autoCapitalize="none"
                    autoComplete="password"
                    error={
                      errors.password ? errors.password.message : undefined
                    }
                    label="Password"
                    maxLength={128}
                    placeholder="Password"
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
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onFieldChange(onChange)}
                  />
                )}
                rules={{required: true, minLength: 8, maxLength: 128}}
              />
            </View>
            <View width="48%">
              <Controller
                control={control}
                name="repeatPassword"
                render={({field: {onChange, onBlur, value}}) => (
                  <TextField
                    autoCapitalize="none"
                    autoComplete="password"
                    error={
                      errors.repeatPassword
                        ? errors.repeatPassword.message
                        : undefined
                    }
                    label="Confirm Password"
                    maxLength={128}
                    placeholder="Repeat Password"
                    returnKeyType="next"
                    rightElement={
                      <SafeTouchable
                        onPress={togglePasswordView('ConfirmPassword')}>
                        <View mr={2}>
                          <Feather
                            name={show.password ? 'eye' : 'eye-off'}
                            size={20}
                          />
                        </View>
                      </SafeTouchable>
                    }
                    secureTextEntry={!show.confirmPassword}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onFieldChange(onChange)}
                  />
                )}
                rules={{required: true, minLength: 8, maxLength: 128}}
              />
            </View>
          </View>
          <View flexDirection="row" mt={4}>
            <View pt={1}>
              <Controller
                control={control}
                name="tncAccepted"
                render={({field: {onChange, value}}) => (
                  <Checkbox
                    accessibilityLabel="Agree"
                    isChecked={value}
                    value="tncAccepted"
                    onChange={onChange}
                  />
                )}
                rules={{required: true}}
              />
            </View>
            <Text fontSize={14} fontWeight="normal" lineHeight={20} ml={2}>
              I agree with the{' '}
              <Text
                color={theme.colors.maroon[900]}
                fontSize={14}
                fontWeight="bold"
                mt={1}
                onPress={openTermsCondition}>
                Terms & Conditions
              </Text>{' '}
              and the{' \n'}
              <Text
                color={theme.colors.maroon[900]}
                fontSize={14}
                fontWeight="bold"
                onPress={openPrivacyPolicy}>
                Privacy Policy
              </Text>
            </Text>
            {errors.tncAccepted && (
              <Text color="error.500" mt={2}>
                {errors.tncAccepted.message}
              </Text>
            )}
          </View>
          <Button
            disabled={!(isValid && isDirty) || loading}
            loading={loading}
            loadingText="Signing Up"
            mt={6}
            testID="sign-up-button"
            title="Sign Up Now"
            onPress={handleSubmit(onSubmit)}
          />
          <View
            alignItems="center"
            flexDirection="row"
            justifyContent="center"
            mt={4}>
            <Text fontSize={14} fontWeight="400" mr={2}>
              Already have an account?
            </Text>
            <View
              borderBottomColor={theme.colors.maroon[900]}
              borderBottomWidth={1}>
              <SafeTouchable onPress={goLogin}>
                <Text
                  color={theme.colors.maroon[900]}
                  fontSize={14}
                  fontWeight="bold">
                  Sign In
                </Text>
              </SafeTouchable>
            </View>
          </View>
        </View>
        <View />
      </ScrollView>
    </SafeAreaContainer>
  );
}

export default Signup;
