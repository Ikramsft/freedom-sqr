/**
 * @format
 */
import React from 'react';
import {StyleSheet} from 'react-native';
import {View, Text} from 'native-base';
import {Controller} from 'react-hook-form';

import {RootStackScreenProps} from 'navigation/DrawerNav';
import {useAppTheme} from 'theme';
import {TextField, Button, SafeTouchable, SafeAreaContainer} from 'components';

import {IEmail, usePasswordForm} from './usePasswordForm';
import {useForgotPassword} from './useForgotPassword';
import {Header} from '../Header';

const initValues: IEmail = {email: ''};

function ForgotPassword(props: RootStackScreenProps<'ForgotPassword'>) {
  const {navigation} = props;
  const theme = useAppTheme();
  const [loading, setLoading] = React.useState(false);

  const {tryForgotPassword} = useForgotPassword();

  const onSuccess = (success: boolean, values: IEmail) => {
    setLoading(false);
    if (success) {
      navigation.push('ForgotPasswordSuccess', {email: values.email});
    }
  };

  const onSubmit = (values: IEmail) => {
    setLoading(true);
    tryForgotPassword(values, success => onSuccess(success, values));
  };

  const form = usePasswordForm(initValues);
  const {control, handleSubmit, formState} = form;
  const {errors, isValid} = formState;

  const handleSignin = () => navigation.navigate('Login');

  const goToHome = () => navigation.navigate('Home');

  return (
    <SafeAreaContainer edges={['top', 'bottom']}>
      <Header onPress={goToHome} />
      <View justifyContent="center">
        <View alignItems="center" px={4}>
          <Text fontSize={22} fontWeight="900" mt={5}>
            Reset Password
          </Text>
          <Text
            alignSelf="center"
            fontSize={16}
            fontWeight="bold"
            mb={2}
            mt={15}>
            Please enter email associated with your account.
          </Text>
        </View>
        <View mt={2} px={4}>
          <View width="100%">
            <Controller
              control={control}
              name="email"
              render={({field: {onChange, value}}) => (
                <TextField
                  autoComplete="email"
                  caretHidden={false}
                  error={errors.email ? errors.email.message : undefined}
                  keyboardType="email-address"
                  label="Email"
                  placeholderTextColor={theme.colors.black[900]}
                  returnKeyType="next"
                  size="lg"
                  style={[
                    styles.inputView,
                    {backgroundColor: theme.colors.white[800]},
                  ]}
                  testID="forgot-email"
                  value={value}
                  onChangeText={onChange}
                />
              )}
              rules={{required: true}}
            />
          </View>
          <Button
            disabled={!isValid || loading}
            loading={loading}
            loadingText="Resetting Password"
            mt={10}
            style={styles.buttonStyle}
            testID="reset-password"
            title="RESET PASSWORD"
            onPress={handleSubmit(onSubmit)}
          />
        </View>
        <View
          alignItems="center"
          flexDirection="row"
          justifyContent="center"
          mt={6}>
          <Text fontSize={14} fontWeight="400" mr={2}>
            Back to
          </Text>
          <View
            borderBottomColor={theme.colors.maroon[900]}
            borderBottomWidth={1}>
            <SafeTouchable onPress={handleSignin}>
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
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  buttonStyle: {
    height: 45,
  },
  inputView: {
    borderRadius: 5,
  },
});

export default ForgotPassword;
