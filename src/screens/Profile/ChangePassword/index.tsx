import React from 'react';
import {View} from 'native-base';
import Feather from 'react-native-vector-icons/Feather';
import {Controller} from 'react-hook-form';

import {RootStackScreenProps} from 'navigation/DrawerNav';
import {
  TextField,
  Button,
  ScrollView,
  SafeTouchable,
  HeaderLeft,
  HeaderTitle,
  SafeAreaContainer,
} from 'components';

import {IChangePassword, useChangePasswordForm} from './useChangePassword';
import {useUpdatePassword} from './useUpdatePassword';
import {ShowPasswordType} from '../../Auth/Signup';

const initValues: IChangePassword = {
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
};

function ChangePassword(props: RootStackScreenProps<'ChangePassword'>) {
  const {navigation} = props;

  const [loading, setLoading] = React.useState(false);

  const [show, setShow] = React.useState({
    currentPassword: false,
    password: false,
    confirmPassword: false,
  });

  const {tryUpdatePassword} = useUpdatePassword();

  React.useLayoutEffect(() => {
    const headerLeft = () => <HeaderLeft onPress={navigation.goBack} />;
    const headerTitle = () => <HeaderTitle title="Change Password" />;
    navigation.setOptions({
      headerShown: true,
      headerBackVisible: false,
      headerTitleAlign: 'center',
      headerTitle,
      headerLeft,
      headerRight: () => null,
    });
  }, [navigation]);

  const form = useChangePasswordForm(initValues);
  const {control, handleSubmit, formState, reset} = form;
  const {errors, isDirty, isValid} = formState;

  const onLogoutSuccess = (success: boolean) => {
    setLoading(false);
    if (success) {
      reset(initValues);
    }
  };

  const onSubmit = (values: IChangePassword) => {
    setLoading(true);
    tryUpdatePassword(
      {newPassword: values.newPassword, oldPassword: values.oldPassword},
      onLogoutSuccess,
    );
  };

  const togglePasswordView = (type: ShowPasswordType) => () => {
    if (type === 'CurrentPassword') {
      setShow(s => ({...s, currentPassword: !s.currentPassword}));
    } else if (type === 'Password') {
      setShow(s => ({...s, password: !s.password}));
    } else if (type === 'ConfirmPassword') {
      setShow(s => ({...s, confirmPassword: !s.confirmPassword}));
    }
  };

  return (
    <SafeAreaContainer>
      <ScrollView>
        <View p={5}>
          <View width="100%">
            <Controller
              control={control}
              name="oldPassword"
              render={({field: {onChange, onBlur, value}}) => (
                <TextField
                  error={
                    errors.oldPassword ? errors.oldPassword.message : undefined
                  }
                  label="Current Password"
                  maxLength={128}
                  placeholder="Current Password"
                  returnKeyType="next"
                  rightElement={
                    <SafeTouchable
                      onPress={togglePasswordView('CurrentPassword')}>
                      <View mr={2}>
                        <Feather
                          name={show.currentPassword ? 'eye' : 'eye-off'}
                          size={20}
                        />
                      </View>
                    </SafeTouchable>
                  }
                  secureTextEntry={!show.currentPassword}
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
              name="newPassword"
              render={({field: {onChange, onBlur, value}}) => (
                <TextField
                  error={
                    errors.newPassword ? errors.newPassword.message : undefined
                  }
                  label="New Password"
                  maxLength={128}
                  placeholder="New Password"
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
                  onChangeText={onChange}
                />
              )}
              rules={{required: true}}
            />
          </View>

          <View width="100%">
            <Controller
              control={control}
              name="confirmPassword"
              render={({field: {onChange, onBlur, value}}) => (
                <TextField
                  error={
                    errors.confirmPassword
                      ? errors.confirmPassword.message
                      : undefined
                  }
                  label="Confirm Password"
                  maxLength={128}
                  placeholder="Confirm Password"
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
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                />
              )}
              rules={{required: true}}
            />
          </View>
          <View
            alignItems="center"
            height="50px"
            justifyContent="center"
            mt={5}>
            <Button
              disabled={!(isValid && isDirty) || loading}
              loading={loading}
              loadingText="CHANGE PASSWORD"
              title="CHANGE PASSWORD"
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaContainer>
  );
}

export default ChangePassword;
