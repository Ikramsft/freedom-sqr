/**
 * @format
 */
import * as Yup from 'yup';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';

import {NAME_REGEX, ZIPCODE_REGEX} from '../../../constants';
import ErrorMessages from '../../../constants/ErrorMessages';

export interface IBusinessPaymentInfo {
  billingName: string;
  address: string;
  city: string;
  stateID: string;
  zipcode: string;
  expireMonth: string;
  expireYear: string;
  numbers: string;
  sameAsBusiness: boolean;
  amount: number;
}

const defaultValues: IBusinessPaymentInfo = {
  billingName: '',
  address: '',
  city: '',
  zipcode: '',
  stateID: '',
  expireMonth: '',
  expireYear: '',
  numbers: '',
  sameAsBusiness: false,
  amount: 29900,
};

const Errors = ErrorMessages.cardInfo;

const schema = Yup.object().shape({
  billingName: Yup.string()
    .required(Errors.billingName.required)
    .min(1, Errors.billingName.valid)
    .max(35, Errors.billingName.valid)
    .matches(NAME_REGEX, Errors.billingName.valid),
  address: Yup.string()
    .required(Errors.address.required)
    .min(5, Errors.address.valid)
    .max(32, Errors.address.valid),
  stateID: Yup.string().required(Errors.state),
  city: Yup.string()
    .trim()
    .required(Errors.city.required)
    .min(2, Errors.city.valid)
    .max(36, Errors.city.valid),
  zipcode: Yup.string().matches(ZIPCODE_REGEX, Errors.zip).required(Errors.zip),
  expireMonth: Yup.string().required(Errors.expireMonth.required),
  expireYear: Yup.string().required(Errors.expireYear.required),
  numbers: Yup.string()
    .min(13, Errors.numbers)
    .max(19, Errors.numbers)
    .required(Errors.numbers),
});

export const useBusinessPaymentForm = (
  initialValues: IBusinessPaymentInfo = defaultValues,
) => {
  return useForm<IBusinessPaymentInfo>({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });
};
