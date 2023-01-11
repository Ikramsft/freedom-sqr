/**
 * @format
 */
import React from 'react';
import {Text, View} from 'native-base';
import {Controller} from 'react-hook-form';

import {RootStackScreenProps} from 'navigation/DrawerNav';
import {
  TextField,
  Button,
  ScrollView,
  HeaderLeft,
  HeaderTitle,
  SafeAreaContainer,
  Title,
} from 'components';

import {IAchDetails, useAchForm} from './useAchForm';
import {useCardHelper} from '../../../../Payments/useCardHelper';
import {useManageAchInfo} from './useManageAchInfo';

function ManageAchInfo(props: RootStackScreenProps<'ManageAchInfo'>) {
  const {navigation, route} = props;

  const isEdit = !!route.params?.info;

  const initialValues = isEdit ? route.params?.info : undefined;
  const form = useAchForm(initialValues);
  const {control, handleSubmit, formState} = form;
  const {errors, isDirty, isValid} = formState;

  const {onFieldChange, onNumericFieldChange} = useCardHelper();

  const {isLoading, tryAddUpdateAchInfo} = useManageAchInfo();

  const onSuccess = (success: boolean) => {
    if (success) {
      navigation.goBack();
    }
  };

  const onSubmit = (values: IAchDetails) => {
    tryAddUpdateAchInfo({...values, callback: onSuccess});
  };

  React.useLayoutEffect(() => {
    const headerLeft = () => <HeaderLeft onPress={navigation.goBack} />;
    const headerTitle = () => (
      <HeaderTitle title={isEdit ? 'Update Info' : 'Add Info'} />
    );
    navigation.setOptions({
      headerShown: true,
      headerBackVisible: false,
      headerTitleAlign: 'center',
      headerTitle,
      headerLeft,
      headerRight: () => null,
    });
  }, [isEdit, navigation]);

  return (
    <SafeAreaContainer>
      <View flex={1} px={3}>
        <ScrollView>
          <View mt={3}>
            {!isEdit ? (
              <View alignItems="center">
                <Title fontSize="3xl" textAlign="center">
                  Freedom Square Affiliate Program
                </Title>
                <Text mt={2}>Direct Deposit Form</Text>
              </View>
            ) : null}
            <Controller
              control={control}
              name="name"
              render={({field: {onChange, onBlur, value}}) => (
                <TextField
                  error={errors.name?.message}
                  label="Name"
                  maxLength={35}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onFieldChange(onChange)}
                />
              )}
              rules={{required: true, minLength: 1, maxLength: 35}}
            />
            <Controller
              control={control}
              name="routingNumber"
              render={({field: {onChange, onBlur, value}}) => (
                <TextField
                  error={errors.routingNumber?.message}
                  keyboardType="number-pad"
                  label="Routing #"
                  maxLength={9}
                  returnKeyType="done"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onNumericFieldChange(onChange)}
                />
              )}
              rules={{required: true, minLength: 9, maxLength: 9}}
            />
            <Controller
              control={control}
              name="accountNumber"
              render={({field: {onChange, onBlur, value}}) => (
                <TextField
                  error={errors.accountNumber?.message}
                  keyboardType="number-pad"
                  label="Account #"
                  maxLength={17}
                  returnKeyType="done"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onNumericFieldChange(onChange)}
                />
              )}
              rules={{required: true, minLength: 8, maxLength: 17}}
            />
            {!isEdit ? (
              <Text mt={4} textAlign="center">
                By completing and submitting this form you are digitally signing
                and giving permission for Freedom Square to make transactions
                with your Banking Institution.
              </Text>
            ) : null}
          </View>
        </ScrollView>
        <Button
          alignSelf="center"
          disabled={!(isValid && isDirty) || isLoading}
          isLoading={isLoading}
          mt={2}
          title={isEdit ? 'SAVE' : 'SUBMIT'}
          width="30%"
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </SafeAreaContainer>
  );
}

export default ManageAchInfo;
