/**
 * @format
 */
import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {View, Divider} from 'native-base';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {RootStackScreenProps} from 'navigation/DrawerNav';
import {useAppTheme} from 'theme';
import {
  TextField,
  Button,
  HeaderLeft,
  HeaderTitle,
  Checkbox,
  SafeAreaContainer,
  SubTitle,
  Dropdown,
} from 'components';

import {Controller} from 'react-hook-form';
import {useCardForm, ICardBilling, ICreditCard} from './useCardForm';
import {useCardHelper} from './useCardHelper';
import {useCardOperations} from './useCardOperations';
import {omitFields} from '../../utils/index';
import {showSnackbar} from '../../utils/SnackBar';
import {useStatesList} from '../BusinessInformation/BusinessInfo/useStatesList';
import {FormType} from '../../constants';

const {ADD, EDIT} = FormType;

export type FormKeyType =
  | 'aliasName'
  | 'numbers'
  | 'billingName'
  | 'expireMonth'
  | 'expireYear'
  | 'cvv'
  | 'address'
  | 'city'
  | 'state'
  | 'zip'
  | 'isDefault';

function ManagePayment(props: RootStackScreenProps<'ManagePayment'>) {
  const {navigation, route} = props;
  const {savedCardValues, formType = ADD} = route.params || {};

  const isEdit = formType === EDIT;

  React.useLayoutEffect(() => {
    const headerLeft = () => <HeaderLeft onPress={navigation.goBack} />;
    const headerTitle = () => (
      <HeaderTitle
        title={isEdit ? 'Update Payment Method' : 'Add Payment Method'}
      />
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

  const {data: states = []} = useStatesList();

  const stateList = React.useMemo(() => {
    return states.map(d => ({...d, label: d.name, value: d.documentId}));
  }, [states]);

  const theme = useAppTheme();

  const {valid, FALLBACK_CARD, removeLeadingSpaces, formatCardNumber} =
    useCardHelper();

  const {adding, updating, addCard, updateCard} = useCardOperations();

  const currentYear = new Date().getFullYear().toString().slice(-2);
  const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');

  const findStateId = React.useCallback(
    (stateName: string) => {
      const selState = stateList.filter(s => s.name === stateName);
      return selState && selState.length ? selState[0].value : stateName;
    },
    [stateList],
  );

  const initialState: ICardBilling =
    isEdit && savedCardValues
      ? {
          aliasName: savedCardValues.aliasName,
          numbers: `**** **** **** ${savedCardValues.lastNumbers}`,
          expireMonth: savedCardValues.expirationDate.slice(0, 2),
          expireYear: savedCardValues.expirationDate.slice(2),
          billingName: savedCardValues.billingName,
          address: savedCardValues.billingAddress.address,
          city: savedCardValues.billingAddress.city,
          state: findStateId(savedCardValues.billingAddress.state),
          zip: savedCardValues.billingAddress.zip,
          isDefault: savedCardValues.isDefault || false,
        }
      : {
          aliasName: '',
          numbers: '',
          expireMonth: currentMonth,
          expireYear: currentYear,
          billingName: '',
          address: '',
          city: '',
          state: stateList[0]?.value,
          zip: '',
          isDefault: false,
        };

  const onAddCard = async (values: ICardBilling) => {
    try {
      const {address, city, state, zip, ...restValue} = values;
      const addCardData: Partial<ICreditCard> = {
        ...restValue,
        expirationDate: `${values.expireMonth}${values.expireYear}`,
        billingAddress: {documentId: '', address, city, state, zip},
      };
      await addCard(addCardData);
      goBack();
    } catch (err: any) {
      const msg = err?.message || 'Something went wrong';
      showSnackbar({message: msg, type: 'error'});
    }
  };

  const onUpdateCard = async (editValues: ICardBilling) => {
    if (savedCardValues) {
      try {
        const {address, city, state, zip, ...restValue} = omitFields(
          editValues,
          ['cvv', 'numbers', 'expireMonth', 'expireYear'],
        );

        const updateDetails: Partial<ICreditCard> = {
          ...restValue,
          expirationDate: `${editValues.expireMonth}${editValues.expireYear}`,
          billingAddress: {
            address,
            city,
            state,
            zip,
            documentId: savedCardValues.billingAddress.documentId,
          },
        };
        await updateCard(updateDetails, savedCardValues?.documentId);
        goBack();
      } catch (err: any) {
        console.log('err=?', err);
      }
    }
  };

  const form = useCardForm(initialState, formType as number);
  const {control, handleSubmit, formState, getValues, setValue, setFocus} =
    form;
  const {isDirty, isValid} = formState;

  const monthDropdownValues = React.useMemo(() => {
    const values = getValues();
    const handleDisablePastMonth = (month: string): boolean => {
      return parseInt(values.expireYear ?? '1', 10) > parseInt(currentYear, 10)
        ? false
        : parseInt(month, 10) < parseInt(currentMonth, 10);
    };

    return Array(12)
      .fill('')
      .map((_, index) => {
        const month = (index + 1).toString().padStart(2, '0');
        return {
          label: month,
          value: month,
          disabled: handleDisablePastMonth(month),
        };
      })
      .filter(m => !m.disabled);
  }, [currentMonth, currentYear, getValues]);

  const yearDropdownValues = React.useMemo(() => {
    return Array(16)
      .fill('')
      .map((_, index) => {
        const yr = (parseInt(currentYear, 10) + index).toString();
        return {label: yr, value: yr, disabled: false};
      });
  }, [currentYear]);

  const onFieldChange = (field: string) => (text: string) => {
    handleChange(field)(removeLeadingSpaces(text));
  };

  let userInputCard;

  const onCardNoChange = (text: string) => {
    userInputCard = valid.number(text).card || FALLBACK_CARD;
    const formatted = formatCardNumber(text, userInputCard);
    setValue('numbers', formatted, {
      shouldTouch: true,
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const toggleDefaultCard = (isDefault: boolean) =>
    setValue('isDefault', isDefault, {
      shouldTouch: true,
      shouldDirty: true,
      shouldValidate: true,
    });

  const scrollStyle: StyleProp<ViewStyle> = {
    paddingBottom: 25,
  };

  const goBack = () => navigation.goBack();

  const handleChange = (key: string) => (value: string) => {
    const fKey = key as FormKeyType;
    setValue(fKey, value, {
      shouldTouch: true,
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <SafeAreaContainer>
      <View flex={1}>
        <KeyboardAwareScrollView
          enableOnAndroid
          bounces={false}
          contentContainerStyle={scrollStyle}
          keyboardShouldPersistTaps="handled">
          <View flexGrow={1} px={4}>
            <View width="100%">
              <Controller
                control={control}
                name="aliasName"
                render={({field: {value}, fieldState: {error}}) => (
                  <TextField
                    error={error ? error.message : undefined}
                    label="Alias"
                    maxLength={35}
                    placeholder="Alias"
                    value={value}
                    onChangeText={onFieldChange('aliasName')}
                  />
                )}
                rules={{required: true}}
              />
            </View>

            <View width="100%">
              <Controller
                control={control}
                name="numbers"
                render={({field: {value}, fieldState: {error}}) => (
                  <TextField
                    editable={!isEdit}
                    error={error ? error.message : undefined}
                    keyboardType="number-pad"
                    label="Credit Card Number"
                    placeholder="Card Number"
                    value={value}
                    onChangeText={onCardNoChange}
                  />
                )}
                rules={{required: true}}
              />
            </View>

            <View width="100%">
              <Controller
                control={control}
                name="billingName"
                render={({field: {value}, fieldState: {error}}) => (
                  <TextField
                    error={error ? error.message : undefined}
                    label="Cardholder Name"
                    maxLength={30}
                    placeholder="Cardholder Name"
                    value={value}
                    onChangeText={onFieldChange('billingName')}
                  />
                )}
                rules={{required: true}}
              />
            </View>

            <View flexDirection="row" justifyContent="space-between">
              <View width="49%">
                <Controller
                  control={control}
                  name="expireMonth"
                  render={({field: {onChange, value}, fieldState: {error}}) => (
                    <Dropdown
                      error={error ? error.message : undefined}
                      list={monthDropdownValues}
                      placeholder="Expiry Month"
                      value={value}
                      onValueChange={onChange}
                    />
                  )}
                  rules={{required: true}}
                />
              </View>
              <View width="49%">
                <Controller
                  control={control}
                  name="expireYear"
                  render={({field: {onChange, value}, fieldState: {error}}) => (
                    <Dropdown
                      error={error ? error.message : undefined}
                      list={yearDropdownValues}
                      placeholder="Expiry Year"
                      value={value}
                      onValueChange={onChange}
                    />
                  )}
                  rules={{required: true}}
                />
              </View>
            </View>
            <Divider backgroundColor={theme.colors.maroon[900]} mt={5} my={2} />
            <View width="100%">
              <Controller
                control={control}
                name="address"
                render={({field: {value}, fieldState: {error}}) => (
                  <TextField
                    error={error ? error.message : undefined}
                    label="Address"
                    maxLength={32}
                    placeholder="Address"
                    value={value}
                    onChangeText={onFieldChange('address')}
                  />
                )}
                rules={{required: true}}
              />
            </View>
            <View flexDirection="row" justifyContent="space-between">
              <View width="49%">
                <Controller
                  control={control}
                  name="city"
                  render={({field: {value}, fieldState: {error}}) => (
                    <TextField
                      error={error ? error.message : undefined}
                      label="City"
                      maxLength={36}
                      placeholder="City"
                      value={value}
                      onChangeText={onFieldChange('city')}
                    />
                  )}
                  rules={{required: true}}
                />
              </View>
              <View width="49%">
                <Controller
                  control={control}
                  name="state"
                  render={({field: {onChange, value}, fieldState: {error}}) => (
                    <Dropdown
                      error={error ? error.message : undefined}
                      list={stateList}
                      placeholder="State"
                      value={value}
                      onValueChange={onChange}
                    />
                  )}
                  rules={{required: true}}
                />
              </View>
            </View>
            <View
              alignItems="center"
              flexDirection="row"
              justifyContent="space-between">
              <View width="49%">
                <Controller
                  control={control}
                  name="zip"
                  render={({field: {value}, fieldState: {error}}) => (
                    <TextField
                      error={error ? error.message : undefined}
                      keyboardType="number-pad"
                      label="Zip Code"
                      maxLength={5}
                      placeholder="Zip Code"
                      value={value}
                      onChangeText={onFieldChange('zip')}
                    />
                  )}
                  rules={{required: true}}
                />
              </View>
              <View pt={10} width="49%">
                <Controller
                  control={control}
                  name="isDefault"
                  render={({field: {value}}) => (
                    <Checkbox
                      isChecked={value}
                      isDisabled={isEdit ? savedCardValues?.isDefault : false}
                      value="isDefault"
                      onChange={toggleDefaultCard}>
                      <SubTitle>Set as Default card</SubTitle>
                    </Checkbox>
                  )}
                  rules={{required: true}}
                />
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
      <View mb={1} mt={4} px={4}>
        <Button
          alignSelf="center"
          disabled={!(isValid && isDirty) || adding || updating}
          isLoading={adding || updating}
          loading={false}
          loadingText={adding ? 'Adding' : 'Updating'}
          title={isEdit ? 'Update' : 'Save'}
          width="50%"
          onPress={handleSubmit(isEdit ? onUpdateCard : onAddCard)}
        />
      </View>
    </SafeAreaContainer>
  );
}

export default ManagePayment;
