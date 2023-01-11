/**
 * @format
 */
import React, {useEffect, useState} from 'react';
import {Divider, View, Text, Spinner, CheckIcon} from 'native-base';
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
  SubTitle,
  Radio,
  Dropdown,
} from 'components';

import {
  IBusinessPaymentInfo,
  useBusinessPaymentForm,
} from './useBusinessPaymentForm';
import Summary from './Summary';
import {useStatesList} from '../BusinessInfo/useStatesList';
import {useCardHelper} from '../../Payments/useCardHelper';
import {
  IExistingCardRequest,
  IPaymentRequest,
  useBusinessPayment,
} from './useBusinessPayment';
import {useCardList} from '../../Profile/Components/CardList/useCardList';
import {IBusinessInfo} from '../useBusinessInfo';

interface Props extends RootStackScreenProps<'BusinessInfo'> {
  businessInfo: IBusinessInfo | undefined;
  handleNext: () => void;
  handleBack: () => void;
}
type CardOption = 'old' | 'new';

function BusinessPayment(props: Props) {
  const {navigation, businessInfo, route, handleNext, handleBack} = props;
  const {from} = route.params || {};

  const {isLoading: loadingCards, data: cards = []} = useCardList();
  const [addingUpdating, setAddingUpdating] = useState(false);
  const [selectedExistingCard, setSelectedExistingCard] = useState<string>(
    cards.length > 0 ? cards[0].documentId : '',
  );

  const [selectCardOption, setSelectCardOption] = useState<CardOption>('old');

  useEffect(() => {
    if (cards.length) {
      setSelectedExistingCard(cards[0].documentId);
    } else {
      setSelectCardOption('new');
    }
  }, [cards, loadingCards]);

  const cardsDropdownValues = React.useMemo(() => {
    return cards.map(c => {
      const label = `${c.aliasName}****${c.lastNumbers}`;
      return {...c, label, value: c.documentId};
    });
  }, [cards]);

  const {tryCreatePayment, tryExistingCardForPayment} = useBusinessPayment();
  const theme = useAppTheme();
  const {valid, FALLBACK_CARD, onFieldChange, formatCardNumber} =
    useCardHelper();

  React.useLayoutEffect(() => {
    const headerLeft = () => <HeaderLeft onPress={navigation.goBack} />;
    const headerTitle = () => <HeaderTitle title="Billing Information" />;
    navigation.setOptions({
      headerShown: true,
      headerBackVisible: false,
      headerTitleAlign: 'center',
      headerTitle,
      headerLeft,
      headerRight: () => null,
    });
  }, [navigation]);

  const {data: states = []} = useStatesList();

  const stateList = React.useMemo(() => {
    return states.map(d => ({...d, label: d.name, value: d.documentId}));
  }, [states]);

  const onSuccess = React.useCallback(
    (success: boolean) => {
      setAddingUpdating(false);
      if (success) {
        handleNext();
      }
    },
    [handleNext],
  );

  const existingCardPayment = React.useCallback(async () => {
    const request: IExistingCardRequest = {
      businessId: businessInfo?.documentId || '',
      cardId: selectedExistingCard,
      amount: 29900,
    };
    setAddingUpdating(true);
    tryExistingCardForPayment(request, onSuccess);
  }, [
    businessInfo?.documentId,
    onSuccess,
    selectedExistingCard,
    tryExistingCardForPayment,
  ]);

  const form = useBusinessPaymentForm();
  const {control, handleSubmit, formState, setValue, watch} = form;
  const {errors, isDirty, isValid} = formState;

  const onCheckout = React.useMemo(() => {
    const onSubmit = (values: IBusinessPaymentInfo) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {sameAsBusiness, expireMonth, expireYear, ...rest} = values;
      const expirationDate = `${expireMonth}${expireYear}`;
      const alias = businessInfo?.name || '';
      const request: IPaymentRequest = {
        ...rest,
        alias,
        expirationDate,
        businessId: businessInfo?.documentId || '',
      };
      setAddingUpdating(true);
      tryCreatePayment(request, onSuccess);
    };

    return selectCardOption === 'old'
      ? existingCardPayment
      : handleSubmit(onSubmit);
  }, [
    businessInfo?.documentId,
    businessInfo?.name,
    existingCardPayment,
    handleSubmit,
    onSuccess,
    selectCardOption,
    tryCreatePayment,
  ]);

  const currentYear = new Date().getFullYear().toString().slice(-2);
  const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');

  const expireYear = watch('expireYear');

  const monthDropdownValues = React.useMemo(() => {
    const handleDisablePastMonth = (month: string): boolean => {
      return parseInt(expireYear, 10) > parseInt(currentYear, 10)
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
  }, [currentMonth, currentYear, expireYear]);

  const yearDropdownValues = React.useMemo(() => {
    return Array(16)
      .fill('')
      .map((_, index) => {
        const yr = (parseInt(currentYear, 10) + index).toString();
        return {
          label: yr,
          value: yr,
          disabled: false,
        };
      });
  }, [currentYear]);

  let userInputCard;

  const onCardNoChange = (text: string) => {
    userInputCard = valid.number(text).card || FALLBACK_CARD;
    const formatted = formatCardNumber(text, userInputCard);
    setValue('numbers', formatted);
  };

  const sameAsBusiness = watch('sameAsBusiness');

  const onToggleSame = React.useCallback(() => {
    if (!sameAsBusiness) {
      const {
        address = '',
        city = '',
        stateId,
        zipcode = '',
      } = businessInfo || {};
      setValue('address', address, {shouldValidate: true});
      setValue('city', city, {shouldValidate: true});
      setValue('stateID', stateId ?? '', {shouldValidate: true});
      setValue('zipcode', zipcode, {shouldValidate: true});
      setValue('sameAsBusiness', true, {shouldValidate: true});
    } else {
      setValue('address', '');
      setValue('city', '');
      setValue('stateID', '');
      setValue('zipcode', '');
      setValue('sameAsBusiness', false);
    }
  }, [businessInfo, sameAsBusiness, setValue]);

  const changeExistingCardSelection = (documentId: string) => {
    setSelectedExistingCard(documentId);
  };

  const togglePaymentMethod = (option: CardOption) => () => {
    setSelectCardOption(option);
  };

  return (
    <SafeAreaContainer>
      <View flexGrow={1} pt={2} px={4}>
        <ScrollView>
          <Text
            alignSelf="center"
            color={theme.colors.maroon[900]}
            fontSize="md">
            Step 5 of 5
          </Text>
          <View mt={2}>
            <SafeTouchable onPress={togglePaymentMethod('old')}>
              <Radio
                checked={selectCardOption === 'old'}
                checkedColor={theme.colors.maroon[900]}
                label="Existing Credit Card"
              />
            </SafeTouchable>
            {loadingCards ? (
              <Spinner />
            ) : (
              <View display={selectCardOption === 'old' ? 'flex' : 'none'}>
                {cardsDropdownValues.length > 0 ? (
                  <Dropdown
                    error={undefined}
                    list={cardsDropdownValues}
                    mt={2}
                    value={selectedExistingCard}
                    onValueChange={changeExistingCardSelection}
                  />
                ) : (
                  <Text mt={2}>No cards found</Text>
                )}
              </View>
            )}
          </View>
          <View mt={3}>
            <SafeTouchable onPress={togglePaymentMethod('new')}>
              <Radio
                checked={selectCardOption === 'new'}
                checkedColor={theme.colors.maroon[900]}
                label="Add New Card"
              />
            </SafeTouchable>
            <View display={selectCardOption === 'new' ? 'flex' : 'none'}>
              <View>
                <Controller
                  control={control}
                  name="numbers"
                  render={({field: {onBlur, value}}) => (
                    <TextField
                      error={
                        errors.numbers ? errors.numbers.message : undefined
                      }
                      keyboardType="number-pad"
                      label="Card Number"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onCardNoChange}
                    />
                  )}
                  rules={{required: true}}
                />
                <Controller
                  control={control}
                  name="billingName"
                  render={({field: {onChange, onBlur, value}}) => (
                    <TextField
                      error={
                        errors.billingName
                          ? errors.billingName.message
                          : undefined
                      }
                      label="Billing Name"
                      maxLength={35}
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onFieldChange(onChange)}
                    />
                  )}
                  rules={{required: true}}
                />
                <View flexDirection="row" justifyContent="space-between">
                  <View width="49%">
                    <Controller
                      control={control}
                      name="expireMonth"
                      render={({field: {onChange, onBlur, value}}) => (
                        <Dropdown
                          error={
                            errors.expireMonth
                              ? errors.expireMonth.message
                              : undefined
                          }
                          list={monthDropdownValues}
                          placeholder="Expiry Month"
                          value={value}
                          onBlur={onBlur}
                          onValueChange={onFieldChange(onChange)}
                        />
                      )}
                      rules={{required: true}}
                    />
                  </View>
                  <View width="49%">
                    <Controller
                      control={control}
                      name="expireYear"
                      render={({field: {onChange, onBlur, value}}) => (
                        <Dropdown
                          error={
                            errors.expireYear
                              ? errors.expireYear.message
                              : undefined
                          }
                          list={yearDropdownValues}
                          placeholder="Expiry Year"
                          value={value}
                          onBlur={onBlur}
                          onValueChange={onFieldChange(onChange)}
                        />
                      )}
                      rules={{required: true}}
                    />
                  </View>
                </View>
              </View>
              <Divider bgColor={theme.colors.red[900]} height={1} mt={4} />
              <View flexGrow={1} mb={5}>
                <SafeTouchable activeOpacity={0.8} onPress={onToggleSame}>
                  <View alignItems="center" flexDirection="row" my={4}>
                    <Controller
                      control={control}
                      name="sameAsBusiness"
                      render={({field: {value}}) => (
                        <View
                          alignItems="center"
                          backgroundColor={
                            value
                              ? theme.colors.maroon[900]
                              : theme.colors.transparent
                          }
                          borderWidth={value ? 0 : 1}
                          height="18px"
                          width="18px">
                          {value ? (
                            <CheckIcon
                              color={theme.colors.white[900]}
                              mt="2px"
                              size="3.5"
                            />
                          ) : null}
                        </View>
                      )}
                    />
                    <SubTitle ml={2}>
                      Billing address same as Business Address
                    </SubTitle>
                  </View>
                </SafeTouchable>
                <Controller
                  control={control}
                  name="address"
                  render={({field: {onChange, onBlur, value}}) => (
                    <TextField
                      error={
                        errors.address ? errors.address.message : undefined
                      }
                      label="Billing Address"
                      maxLength={32}
                      placeholder="Billing Address"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onFieldChange(onChange)}
                    />
                  )}
                  rules={{required: true, minLength: 5, maxLength: 32}}
                />
                <View flexDirection="row" justifyContent="space-between">
                  <View width="49%">
                    <Controller
                      control={control}
                      name="city"
                      render={({field: {onChange, onBlur, value}}) => (
                        <TextField
                          error={errors.city ? errors.city.message : undefined}
                          label="Billing City"
                          maxLength={36}
                          placeholder="Billing City"
                          value={value}
                          onBlur={onBlur}
                          onChangeText={onFieldChange(onChange)}
                        />
                      )}
                      rules={{required: true, minLength: 2, maxLength: 36}}
                    />
                  </View>
                  <View width="49%">
                    <Controller
                      control={control}
                      name="stateID"
                      render={({field: {onChange, onBlur, value}}) => (
                        <Dropdown
                          error={
                            errors.stateID ? errors.stateID.message : undefined
                          }
                          list={stateList}
                          placeholder="Billing State"
                          value={value}
                          onBlur={onBlur}
                          onValueChange={onFieldChange(onChange)}
                        />
                      )}
                      rules={{required: true}}
                    />
                  </View>
                </View>
                <View width="49%">
                  <Controller
                    control={control}
                    name="zipcode"
                    render={({field: {onChange, onBlur, value}}) => (
                      <TextField
                        error={
                          errors.zipcode ? errors.zipcode.message : undefined
                        }
                        keyboardType="number-pad"
                        label="Billing Zip Code"
                        maxLength={5}
                        placeholder="Billing Zip Code"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onFieldChange(onChange)}
                      />
                    )}
                    rules={{required: true, maxLength: 5}}
                  />
                </View>
              </View>
            </View>
          </View>
          <Summary />
        </ScrollView>
        <View
          alignItems="center"
          flexDirection="row"
          justifyContent="space-between"
          mb={2}>
          {from !== 'profile' && (
            <View alignItems="center" flex={1} justifyContent="center" mr={5}>
              <Button
                backgroundColor={theme.colors.transparent}
                borderColor={theme.colors.brand['600']}
                fontWeight="normal"
                mt={6}
                textColor={theme.colors.brand['600']}
                title="BACK"
                variant="outline"
                width="full"
                onPress={handleBack}
              />
            </View>
          )}
          <View alignItems="center" flex={1} justifyContent="center">
            <Button
              disabled={
                selectCardOption === 'old' && selectedExistingCard.length > 0
                  ? false
                  : !(isValid && isDirty) || addingUpdating
              }
              fontWeight="normal"
              loading={addingUpdating}
              loadingText="Updating"
              mt={6}
              title="CHECKOUT"
              width="full"
              onPress={onCheckout}
            />
          </View>
        </View>
      </View>
    </SafeAreaContainer>
  );
}

export default BusinessPayment;
