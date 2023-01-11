/**
 * @format
 */
import * as React from 'react';
import {Text, useDisclose, View, Modal} from 'native-base';
import {Controller} from 'react-hook-form';

import {useAppTheme} from 'theme';
import {Button, TextField} from 'components';

import {useUpdateProfile} from '../../screens/Profile/ProfileInformation/useUpdateProfile';
import {useUserInfo} from '../../hooks/useUserInfo';
import {useUserSignup} from '../../screens/Auth/Signup/useUserSignup';
import {IFirstLogin, useFirstLoginForm} from './useFirstLoginForm';
import ErrorMessages from '../../constants/ErrorMessages';

function FirstLoginPopup() {
  const theme = useAppTheme();

  const [validating, setValidating] = React.useState(false);

  const {user, authenticated: isLoggedIn} = useUserInfo();
  const {isOpen, onOpen, onClose} = useDisclose();

  const {isLoading: isUpdating, tryUpdateProfile} = useUpdateProfile();
  const {tryCheckUserExists} = useUserSignup();

  React.useEffect(() => {
    if (
      isLoggedIn &&
      user?.userName &&
      user?.email &&
      user.userName === user.email &&
      !isOpen
    ) {
      onOpen();
    }
  }, [isOpen, onClose, onOpen, isLoggedIn, user]);

  const onSuccess = (success: boolean) => {
    setValidating(false);
    if (success) {
      onClose();
    }
  };

  const onSubmit = async (v: IFirstLogin) => {
    setValidating(true);
    const query = `userName=${v.userName}`;
    const exists = await tryCheckUserExists(query);
    const {userNameExists} = exists;
    if (!userNameExists) {
      tryUpdateProfile({values: v, callback: onSuccess});
    } else {
      setValidating(false);
      setError('userName', {message: ErrorMessages.signup.userNameExists});
    }
  };

  const form = useFirstLoginForm({userName: ''});

  const {control, handleSubmit, formState, setError} = form;
  const {isDirty, isValid} = formState;

  if (!isOpen) {
    return null;
  }

  return (
    <Modal
      avoidKeyboard
      animationPreset="slide"
      backgroundColor={theme.colors.black[500]}
      closeOnOverlayClick={false}
      isOpen={isOpen}
      size="full">
      <View
        alignItems="center"
        bg={theme.colors.black[500]}
        flex={1}
        justifyContent="center">
        <View
          bg={theme.colors.white[900]}
          borderRadius={5}
          mx={4}
          px={30}
          py={4}>
          <Text fontSize={20} fontWeight="600" py={5} textAlign="center">
            Welcome Back!
          </Text>
          <Text fontSize={16} fontWeight="400">
            Please enter a Username so you can interact with the community.
          </Text>
          <View
            alignItems="center"
            flexDirection="row"
            justifyContent="center"
            mb={2}
            mt={5}
            pt={2}
            width="100%">
            <View flex={1}>
              <View width="100%">
                <Controller
                  control={control}
                  name="userName"
                  render={({
                    field: {onChange, onBlur, value},
                    fieldState: {error},
                  }) => (
                    <TextField
                      autoCapitalize="none"
                      autoComplete="username"
                      error={error ? error.message : undefined}
                      label=""
                      maxLength={75}
                      placeholder="Username"
                      returnKeyType="go"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                    />
                  )}
                  rules={{required: true, minLength: 4, maxLength: 75}}
                />
              </View>
            </View>
          </View>
          <View ml={3}>
            <Button
              alignSelf="center"
              disabled={!(isValid && isDirty) || isUpdating || validating}
              height={50}
              loading={isUpdating || validating}
              loadingText="Saving"
              minWidth={100}
              title="Save"
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default FirstLoginPopup;
