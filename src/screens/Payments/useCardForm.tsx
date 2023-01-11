/**
 * @format
 */
import {useMemo} from 'react';
import * as Yup from 'yup';
import valid from 'card-validator';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';

import {
  BILLING_NAME_REGEX,
  FormType,
  NAME_REGEX,
  ZIPCODE_REGEX,
} from '../../constants';
import ErrorMessages from '../../constants/ErrorMessages';

export interface ICreditCard {
  documentId: string;
  aliasName: string;
  billingName: string;
  numbers: string;
  expirationDate: string;
  billingAddress: {
    documentId: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  isDefault: boolean;
  lastNumbers?: string;
}

export interface ICardBilling {
  aliasName: string;
  numbers: string;
  billingName: string;
  expireMonth: string;
  expireYear: string;
  cvv?: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
}

const Errors = ErrorMessages.cardInfo;

const billingValidationSchema = (formType: number) =>
  Yup.object().shape({
    aliasName: Yup.string()
      .trim()
      .required(Errors.aliasName.required)
      .min(1, Errors.aliasName.valid)
      .matches(NAME_REGEX, Errors.aliasName.valid),
    ...(formType === FormType.ADD && {
      numbers: Yup.string()
        .test('card-validator', Errors.numbers, value => {
          const numberValidation = valid.number(value);
          return numberValidation.isValid;
        })
        .required(Errors.numbers),
    }),
    billingName: Yup.string()
      .trim()
      .required(Errors.billingName.required)
      .min(1, Errors.billingName.valid)
      .matches(BILLING_NAME_REGEX, Errors.billingName.valid),
    expireMonth: Yup.string()
      .required(Errors.expireMonth.required)
      .test(
        'test-valid-expiration-month',
        Errors.expireMonth.valid,
        value => valid.expirationMonth(value).isValid,
      ),
    expireYear: Yup.string()
      .required(Errors.expireYear.required)
      .test(
        'test-valid-expiration-year',
        Errors.expireYear.valid,
        value => valid.expirationYear(value).isValid,
      ),
    address: Yup.string()
      .trim()
      .required(Errors.address.required)
      .min(5, Errors.address.valid),
    city: Yup.string()
      .trim()
      .required(Errors.city.required)
      .min(2, Errors.city.valid),
    state: Yup.string().required(Errors.state),
    zip: Yup.string().matches(ZIPCODE_REGEX, Errors.zip).required(Errors.zip),
  });

export const useCardForm = (initialValues: ICardBilling, formType: number) => {
  const validationSchema = useMemo(() => {
    return billingValidationSchema(formType);
  }, [formType]);

  return useForm<ICardBilling>({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });
};
