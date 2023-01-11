/**
 * @format
 */
import React, {useState} from 'react';
import {Text, View} from 'native-base';
import Feather from 'react-native-vector-icons/Feather';
import {StyleSheet} from 'react-native';
import {cloneDeep} from 'lodash';
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
  Checkbox,
  SubTitle,
  Dropdown,
  MultiSelectDropdown,
} from 'components';

import {IBusinessInfoForm, useBusinessInfoForm} from '../useBusinessInfoForm';
import CustomerSupport from '../Components/CustomerSupport';
import {useBusinessCategories} from './useBusinessCategories';
import {useStatesList} from './useStatesList';
import {formatPhoneNumber, getOriginalNo} from '../../../utils/index';
import {IBusinessInfo} from '../useBusinessInfo';
import {useAddUpdateBusiness} from '../useAddUpdateBusiness';
import {useCardHelper} from '../../Payments/useCardHelper';

interface Props extends RootStackScreenProps<'BusinessInfo'> {
  initialValues: IBusinessInfoForm | undefined;
  businessInfo: IBusinessInfo | undefined;
  handleNext: () => void;
}

function BusinessInfo(props: Props) {
  const {navigation, route, handleNext, initialValues, businessInfo} = props;
  const {from} = route?.params || {};
  const fromProfile = from === 'profile';

  const theme = useAppTheme();
  const {tryAddUpdateBusiness} = useAddUpdateBusiness();

  const {onFieldChange} = useCardHelper();

  const {data = []} = useBusinessCategories();
  const {data: states = []} = useStatesList();

  const onSubmit = (submittedValues: IBusinessInfoForm) => {
    if (isDirty) {
      setAddingUpdating(true);

      const currentData = cloneDeep(submittedValues);
      currentData.documentId = businessInfo?.documentId || '';

      if (fromProfile) {
        delete currentData.name;
        delete currentData.phone;
      }

      const params = {
        ...currentData,
        phone: getOriginalNo(currentData?.phone)?.toString(),
        isUpdate: fromProfile,
        callback: onSuccess,
      };

      tryAddUpdateBusiness(params);
    } else {
      onSuccess(true);
    }
  };

  const form = useBusinessInfoForm(initialValues);
  const {control, handleSubmit, formState} = form;
  const {errors, isDirty, isValid} = formState;

  const [addingUpdating, setAddingUpdating] = useState(false);
  const [isSupport, setIsSupport] = React.useState<boolean | 'name' | 'phone'>(
    false,
  );

  React.useLayoutEffect(() => {
    const headerLeft = () => <HeaderLeft onPress={navigation.goBack} />;
    const headerTitle = () => <HeaderTitle title="Business Information" />;
    navigation.setOptions({
      headerShown: true,
      headerBackVisible: false,
      headerTitleAlign: 'center',
      headerTitle,
      headerLeft,
      headerRight: () => null,
    });
  }, [navigation]);

  const categoryList = React.useMemo(() => {
    return data.map(d => ({...d, label: d.name, value: d.documentId}));
  }, [data]);

  const stateList = React.useMemo(() => {
    return states.map(d => ({...d, label: d.name, value: d.documentId}));
  }, [states]);

  const onSuccess = (success: boolean) => {
    if (success) {
      handleNext();
    }
    setAddingUpdating(false);
  };

  return (
    <>
      <CustomerSupport
        modalRemove={() => setIsSupport(false)}
        support={isSupport}
      />
      <View flexGrow={1} my={2} px={4}>
        {!fromProfile && (
          <Text
            alignSelf="center"
            color={theme.colors.maroon[900]}
            fontSize="md">
            Step 1 of 5
          </Text>
        )}
        <ScrollView>
          <Controller
            control={control}
            name="name"
            render={({field: {onChange, onBlur, value}}) => (
              <TextField
                editable={!fromProfile}
                error={errors.name ? errors.name?.message : undefined}
                label="Business Name"
                maxLength={75}
                placeholder="Enter the name of your business"
                rightElement={
                  fromProfile ? (
                    <Feather
                      name="info"
                      style={styles.info}
                      onPress={() => {
                        setIsSupport('name');
                      }}
                    />
                  ) : undefined
                }
                value={value}
                onBlur={onBlur}
                onChangeText={onFieldChange(onChange)}
              />
            )}
            rules={{required: true}}
          />
          <Controller
            control={control}
            name="address"
            render={({field: {onChange, onBlur, value}}) => (
              <TextField
                error={errors.address ? errors.address.message : undefined}
                label="Address"
                maxLength={32}
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
                name="city"
                render={({field: {onChange, onBlur, value}}) => (
                  <TextField
                    error={errors.city ? errors.city.message : undefined}
                    label="City"
                    maxLength={36}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onFieldChange(onChange)}
                  />
                )}
                rules={{required: true}}
              />
            </View>
            <View width="49%">
              <Controller
                control={control}
                name="stateId"
                render={({field: {onChange, onBlur, value}}) => (
                  <Dropdown
                    error={errors.stateId ? errors.stateId.message : undefined}
                    list={stateList}
                    placeholder="Select State"
                    value={value}
                    onBlur={onBlur}
                    onValueChange={onChange}
                  />
                )}
                rules={{required: true}}
              />
            </View>
          </View>
          <Controller
            control={control}
            name="zipcode"
            render={({field: {onChange, onBlur, value}}) => (
              <TextField
                error={errors.zipcode ? errors.zipcode.message : undefined}
                keyboardType="number-pad"
                label="Zip Code"
                maxLength={5}
                placeholder="Zip Code"
                value={String(value)}
                onBlur={onBlur}
                onChangeText={onFieldChange(onChange)}
              />
            )}
            rules={{required: true}}
          />
          <Controller
            control={control}
            name="email"
            render={({field: {onChange, onBlur, value}}) => (
              <TextField
                autoCapitalize="none"
                autoComplete="email"
                caretHidden={false}
                editable={!fromProfile}
                error={errors.email ? errors.email.message : ''}
                keyboardType="email-address"
                label="Business Email"
                placeholder="Enter your business email address"
                returnKeyType="next"
                value={value}
                onBlur={onBlur}
                onChangeText={onFieldChange(onChange)}
              />
            )}
            rules={{required: true}}
          />
          <View>
            <Controller
              control={control}
              name="businessCategoryIds"
              render={({field: {onChange, onBlur, value}}) => (
                <MultiSelectDropdown
                  error={
                    errors.businessCategoryIds
                      ? errors.businessCategoryIds.message
                      : undefined
                  }
                  label="Business Category (Max 5)"
                  list={categoryList}
                  maxLength={5}
                  placeholder="Select Business Category"
                  values={value}
                  onBlur={onBlur}
                  onSelect={onChange}
                />
              )}
              rules={{required: true}}
            />
            <Controller
              control={control}
              name="website"
              render={({field: {onChange, onBlur, value}}) => (
                <TextField
                  autoCapitalize="none"
                  error={errors.website ? errors.website.message : undefined}
                  label="Business Website"
                  placeholder="Enter your business website"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onFieldChange(onChange)}
                />
              )}
              rules={{required: true}}
            />
            <Controller
              control={control}
              name="phone"
              render={({field: {onChange, onBlur, value}}) => (
                <TextField
                  editable={!fromProfile}
                  error={errors.phone ? errors.phone.message : undefined}
                  InputLeftElement={<Text ml={2}>+1</Text>}
                  keyboardType="number-pad"
                  label="Business Phone"
                  maxLength={14}
                  placeholder="Business Phone"
                  rightElement={
                    fromProfile ? (
                      <SafeTouchable
                        onPress={() => {
                          setIsSupport('phone');
                        }}>
                        <Feather name="info" style={styles.info} />
                      </SafeTouchable>
                    ) : undefined
                  }
                  value={formatPhoneNumber(value || '')}
                  onBlur={onBlur}
                  onChangeText={onFieldChange(onChange)}
                />
              )}
              rules={{required: true}}
            />
            <Controller
              control={control}
              name="contactPersonName"
              render={({field: {onChange, onBlur, value}}) => (
                <TextField
                  error={
                    errors.contactPersonName
                      ? errors.contactPersonName.message
                      : undefined
                  }
                  label="Contact Person Name"
                  maxLength={35}
                  placeholder="Enter name for contact purposes"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onFieldChange(onChange)}
                />
              )}
              rules={{required: true}}
            />
            <View py={5}>
              <Controller
                control={control}
                name="onlineOnly"
                render={({field: {onChange, value}}) => (
                  <Checkbox
                    isChecked={value}
                    value="onlineOnly"
                    onChange={onChange}>
                    <SubTitle>Set as an online only business</SubTitle>
                  </Checkbox>
                )}
                rules={{required: true}}
              />
            </View>
          </View>
        </ScrollView>
        <View mb={2} pt={2} px={4}>
          <Button
            alignSelf="center"
            disabled={
              fromProfile ? !(isDirty && isValid) : !isValid || addingUpdating
            }
            loading={addingUpdating}
            title={fromProfile ? 'Save' : 'Next'}
            width="50%"
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </View>
    </>
  );
}

BusinessInfo.whyDidYouRender = __DEV__;

const styles = StyleSheet.create({
  info: {
    fontSize: 20,
    paddingRight: 15,
  },
});

export default BusinessInfo;
