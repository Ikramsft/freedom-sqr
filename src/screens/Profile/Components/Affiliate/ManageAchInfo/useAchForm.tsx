/**
 * @format
 */
import * as Yup from 'yup';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';

import {NAME_REGEX_WITHOUT_NUMBERS} from '../../../../../constants';
import ErrorMessages from '../../../../../constants/ErrorMessages';

export interface IAchDetails {
  documentId: string;
  name: string;
  accountNumber: string;
  routingNumber: string;
  isDefault: boolean;
}

export const DEFAULT_VALUES: IAchDetails = {
  documentId: '',
  name: '',
  accountNumber: '',
  routingNumber: '',
  isDefault: false,
};

const Errors = ErrorMessages.achInfo;

const SCHEMA = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required(Errors.name.required)
    .min(1, Errors.name.valid)
    .max(35, Errors.name.valid)
    .matches(NAME_REGEX_WITHOUT_NUMBERS, Errors.name.valid),
  routingNumber: Yup.string()
    .required(Errors.routingNumber.valid)
    .min(9, Errors.routingNumber.valid)
    .max(9, Errors.routingNumber.valid),
  accountNumber: Yup.string()
    .required(Errors.accountNumber.valid)
    .min(8, Errors.accountNumber.valid)
    .max(17, Errors.accountNumber.valid),
});

export const useAchForm = (initialValues: IAchDetails = DEFAULT_VALUES) => {
  return useForm<IAchDetails>({
    defaultValues: initialValues,
    resolver: yupResolver(SCHEMA),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });
};
