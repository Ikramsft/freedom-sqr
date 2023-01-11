/**
 * @format
 */
import React, {useEffect, useState} from 'react';
import {Spinner, View} from 'native-base';

import {RootStackScreenProps} from 'navigation/DrawerNav';
import {SafeAreaContainer} from 'components';

import BusinessInfo from './BusinessInfo';
import {
  BusinessSteps,
  convertToBusinessForm,
  useBusinessInfo,
} from './useBusinessInfo';
import BusinessLinks from './BusinessLinks';
import BusinessDetailsForm from './BusinessDetailsFrom';
import BusinessImage from './BusinessImage';
import BusinessPayment from './BusinessPayment';
import BusinessSubmission from './BusinessSubmission';

const {
  BUSINESS_IMAGES,
  BUSINESS_DETAILS,
  BUSINESS_SOCIAL_LINKS,
  PAYMENT,
  COMPLETED,
  PAYMENT_PROCESSING,
  PAYMENT_FAILED,
  PAYMENT_SUCCESS,
  BUSINESS_INFO,
} = BusinessSteps;

function BusinessInfoScreen(props: RootStackScreenProps<'BusinessInfo'>) {
  const {route, navigation} = props;
  const {from, step: profileStep} = route?.params || {};

  const fromProfile = from === 'profile';
  const {data, isLoading, isRefetching} = useBusinessInfo();

  const [step, setStep] = useState<BusinessSteps | undefined>();

  useEffect(() => {
    const businessStep = profileStep || data?.step || BUSINESS_INFO;
    if (!isLoading && !isRefetching && !step && businessStep) {
      setStep(businessStep);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isLoading, isRefetching]);

  const updateStep = (value: BusinessSteps) => {
    if (fromProfile) {
      navigation.goBack();
    }
    setStep(value);
  };

  if (isLoading || isRefetching) {
    return (
      <SafeAreaContainer>
        <View alignItems="center" flexGrow={1} justifyContent="center">
          <Spinner />
        </View>
      </SafeAreaContainer>
    );
  }

  const initialValues = convertToBusinessForm(data);

  return (
    <SafeAreaContainer>
      <View flexGrow={1}>
        {step === BUSINESS_INFO ? (
          <BusinessInfo
            {...props}
            businessInfo={data}
            handleNext={() => updateStep(BUSINESS_DETAILS)}
            initialValues={initialValues}
          />
        ) : null}
        {step === BUSINESS_DETAILS ? (
          <BusinessDetailsForm
            {...props}
            businessInfo={data}
            handleBack={() => updateStep(BUSINESS_INFO)}
            handleNext={() => updateStep(BUSINESS_SOCIAL_LINKS)}
          />
        ) : null}
        {step === BUSINESS_SOCIAL_LINKS ? (
          <BusinessLinks
            {...props}
            businessInfo={data}
            handleBack={() => updateStep(BUSINESS_DETAILS)}
            handleNext={() => updateStep(BUSINESS_IMAGES)}
          />
        ) : null}
        {step === BUSINESS_IMAGES ? (
          <BusinessImage
            {...props}
            businessInfo={data}
            handleBack={() => updateStep(BUSINESS_SOCIAL_LINKS)}
            handleNext={() => updateStep(PAYMENT)}
          />
        ) : null}
        {step && [PAYMENT, PAYMENT_FAILED].includes(step) ? (
          <BusinessPayment
            {...props}
            businessInfo={data}
            handleBack={() => updateStep(BUSINESS_IMAGES)}
            handleNext={() => updateStep(COMPLETED)}
          />
        ) : null}
        {step &&
        [COMPLETED, PAYMENT_PROCESSING, PAYMENT_SUCCESS].includes(step) ? (
          <BusinessSubmission
            {...props}
            isSetupCompleted={data?.step === COMPLETED}
          />
        ) : null}
      </View>
    </SafeAreaContainer>
  );
}

BusinessInfoScreen.whyDidYouRender = __DEV__;

export default BusinessInfoScreen;
