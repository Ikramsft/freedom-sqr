/**
 * @format
 */
import React, {useMemo} from 'react';
import {CheckIcon, Spinner, Text, View} from 'native-base';
import {Controller} from 'react-hook-form';
import Feather from 'react-native-vector-icons/Feather';

import {TextField, Button, ScrollView, SafeAreaContainer} from 'components';
import {Avatar} from 'components/Avatar';

import {IProfileForm, useProfileForm} from './useProfileForm';
import {useUserInfo} from '../../../hooks/useUserInfo';
import {useUserSignup} from '../../Auth/Signup/useUserSignup';
import {useUpdateProfile} from './useUpdateProfile';
import {useUpdateEmail} from './useUpdateEmail';

export interface IProfile {
  name: string;
  username: string;
  email: string;
}

interface Props {
  onResetPassword: () => void;
  onDeleteAccount: () => void;
}

function ProfileInformation(props: Props) {
  const {onResetPassword, onDeleteAccount} = props;

  const [validating, setValidating] = React.useState({
    email: false,
    userName: false,
  });

  const {isLoading, tryUpdateProfile} = useUpdateProfile();
  const {isLoading: emailLoading, tryUpdateEmail} = useUpdateEmail();

  const {user} = useUserInfo();

  const {tryValidateUsername, tryValidateEmail} = useUserSignup();

  const form = useProfileForm({email: user.email, userName: user.userName});

  const {control, handleSubmit, formState, reset, getValues, setError} = form;
  const {errors, isValid} = formState;

  const onSave = async (values: IProfileForm) => {
    try {
      setValidating(s => ({...s, userName: true}));
      const isValidUsername = await tryValidateUsername(values.userName);
      if (isValidUsername) {
        tryUpdateProfile({values});
        reset(values);
      } else {
        await setError('userName', {
          message: 'Username already in use, please select another.',
        });
      }
      setValidating(s => ({...s, userName: false}));
    } catch (error) {
      setValidating(s => ({...s, userName: false}));
      console.log('error->', error);
    }
  };

  const onEmailChange = async (values: IProfileForm) => {
    try {
      setValidating(s => ({...s, email: true}));
      const isValidEmail = await tryValidateEmail(values.email);
      if (isValidEmail) {
        tryUpdateEmail({values});
        reset(values);
      } else {
        await setError('email', {message: 'Email already exists'});
      }
      setValidating(s => ({...s, email: false}));
    } catch (error) {
      setValidating(s => ({...s, email: false}));
      console.log('error->', error);
    }
  };

  const values = useMemo(() => {
    return getValues();
  }, [getValues]);

  return (
    <SafeAreaContainer>
      <ScrollView>
        <View pointerEvents={isLoading ? 'none' : 'auto'} px={4}>
          <View>
            <Text fontSize={16} fontWeight={600} my={3}>
              Edit Profile
            </Text>
            <Avatar
              avatarViewAttribute={
                user?.croppedImageDetails ? user.croppedImageDetails : undefined
              }
              fontSize={28}
              originalAvatar={user.originalImageReadUrl}
              subTitle="Upload Avatar"
              uriAvatar={user?.croppedImageReadUrl}
            />
          </View>
          <View width="100%">
            <Controller
              control={control}
              name="userName"
              render={({
                field: {onChange, onBlur, value},
                fieldState: {isDirty},
              }) => {
                // const validUsername = getValues('validUsername');
                return (
                  <View flexDirection="row">
                    <View width="85%">
                      <TextField
                        autoCapitalize="none"
                        error={
                          errors.userName ? errors.userName.message : undefined
                        }
                        isDisabled={isLoading}
                        label="Username"
                        placeholder="Enter Username"
                        returnKeyType="next"
                        rightElement={
                          <View mr="3">
                            {validating.userName ? (
                              value !== '' ? (
                                <Spinner accessibilityLabel="Validating user name" />
                              ) : undefined
                            ) : !errors.userName && values.validUsername ? (
                              <CheckIcon color="green.500" mt={2} size="5" />
                            ) : undefined}
                          </View>
                        }
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
                      />
                    </View>
                    <View alignItems="flex-end" width="15%">
                      <Button
                        disabled={
                          !errors.userName &&
                          (!(isValid && isDirty) ||
                            isLoading ||
                            user.userName === value)
                        }
                        fontWeight="normal"
                        height={12}
                        loading={isLoading}
                        ml={4}
                        mt="0.5"
                        position="absolute"
                        title={<Feather name="check" size={20} />}
                        top={9}
                        width="12"
                        onPress={handleSubmit(onSave)}
                      />
                    </View>
                  </View>
                );
              }}
              rules={{required: true}}
            />
          </View>
          <View width="100%">
            <Controller
              control={control}
              name="email"
              render={({
                field: {onChange, onBlur, value},
                fieldState: {isDirty},
              }) => (
                <View flexDirection="row">
                  <View width="85%">
                    <TextField
                      autoCapitalize="none"
                      error={errors.email ? errors.email.message : undefined}
                      keyboardType="email-address"
                      label="Email"
                      placeholder="Enter a valid email address"
                      returnKeyType="next"
                      rightElement={
                        <View mr="3">
                          {validating.email ? (
                            value !== '' ? (
                              <Spinner accessibilityLabel="Validating email" />
                            ) : undefined
                          ) : !errors.email && values.validEmail ? (
                            <CheckIcon color="green.500" mt={2} size="5" />
                          ) : undefined}
                        </View>
                      }
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                    />
                  </View>
                  <View alignItems="flex-end" pl={3} width="15%">
                    <Button
                      disabled={
                        !errors.email &&
                        (!(isValid && isDirty) ||
                          emailLoading ||
                          user.email === value)
                      }
                      fontWeight="normal"
                      height={12}
                      isLoading={emailLoading}
                      ml={4}
                      mt="0.5"
                      position="absolute"
                      title={<Feather name="check" size={20} />}
                      top={9}
                      width="12"
                      onPress={handleSubmit(onEmailChange)}
                    />
                  </View>
                </View>
              )}
              rules={{required: true}}
            />
          </View>
          <Button
            mt={6}
            title={'Change Password'.toUpperCase()}
            onPress={onResetPassword}
          />
        </View>
      </ScrollView>
      <Button
        colorScheme="danger"
        mx={4}
        title={'Delete Account'.toUpperCase()}
        onPress={onDeleteAccount}
      />
    </SafeAreaContainer>
  );
}

export {ProfileInformation};
