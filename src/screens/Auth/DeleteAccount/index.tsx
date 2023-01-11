/**
 * @format
 */
import React from 'react';
import {View, Text} from 'native-base';
import Feather from 'react-native-vector-icons/Feather';
import {Controller} from 'react-hook-form';
import {CommonActions} from '@react-navigation/native';

import {RootStackScreenProps} from 'navigation/DrawerNav';
import {
  TextField,
  SafeTouchable,
  Button,
  ScrollView,
  HeaderLeft,
  SafeAreaContainer,
  HeaderTitle,
} from 'components';

import {useDeleteForm} from './useDeleteForm';
import {useUserDelete} from './useUserDelete';
import {ILogin} from '../Login/useLoginForm';

function DeleteAccount(props: RootStackScreenProps<'DeleteAccount'>) {
  const {navigation} = props;

  const [loading, setLoading] = React.useState(false);
  const [show, setShow] = React.useState(false);

  const {tryDeleteUser} = useUserDelete();

  React.useLayoutEffect(() => {
    const headerLeft = () => <HeaderLeft onPress={navigation.goBack} />;
    const headerTitle = () => <HeaderTitle title="Delete Account" />;
    navigation.setOptions({
      headerShown: true,
      headerBackVisible: false,
      headerTitleAlign: 'center',
      headerTitle,
      headerLeft,
      headerRight: () => null,
    });
  }, [navigation]);

  const onDeleteSuccess = (success: boolean) => {
    setLoading(false);
    if (success) {
      navigation.dispatch(
        CommonActions.reset({index: 0, routes: [{name: 'DrawerNav'}]}),
      );
    }
  };

  const onConfirm = (values: ILogin) => {
    setLoading(true);
    tryDeleteUser(values, onDeleteSuccess);
  };

  const initialValues: ILogin = {email: '', password: ''};
  const form = useDeleteForm(initialValues);
  const {control, handleSubmit, formState} = form;
  const {errors, isValid} = formState;

  const togglePasswordView = () => setShow(s => !s);

  return (
    <SafeAreaContainer edges={['bottom']}>
      <ScrollView pointerEvents={loading ? 'none' : 'auto'}>
        <View px={6}>
          <Text fontSize="md" mt={2} textAlign="justify">
            Your personal information, payment information, images, and user
            content will no longer be viewable on{' '}
            <Text color="brand.950" fontWeight="bold">
              Freedom Square.
            </Text>
          </Text>
          <Text fontSize="md" mt={2}>
            It will be permanently deleted and all subscriptions canceled.
          </Text>
          <Text fontSize="md" mt={2} textAlign="justify">
            To confirm enter your email and password.
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
          <Button
            colorScheme="danger"
            disabled={!isValid}
            loading={loading}
            loadingText="Deleting Account"
            mt={6}
            testID="delete-button"
            title={'Delete Account'.toUpperCase()}
            onPress={handleSubmit(onConfirm)}
          />
        </View>
      </ScrollView>
    </SafeAreaContainer>
  );
}

export default DeleteAccount;
