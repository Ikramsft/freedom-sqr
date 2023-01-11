/**
 * @format
 */
import * as Yup from 'yup';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';

import {PASS_REGEX} from '../../../constants';
import ErrorMessages from '../../../constants/ErrorMessages';

export interface IChangePassword {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const defaultValues: IChangePassword = {
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
};

const Errors = ErrorMessages.password;

const schema = Yup.object().shape({
  oldPassword: Yup.string()
    .required(Errors.valid)
    .min(8, Errors.valid)
    .matches(PASS_REGEX, Errors.valid),
  newPassword: Yup.string()
    .required(Errors.valid)
    .min(8, Errors.valid)
    .matches(PASS_REGEX, Errors.valid),
  confirmPassword: Yup.string()
    .required(Errors.match)
    .oneOf([Yup.ref('newPassword'), null], Errors.match),
});

export const useChangePasswordForm = (
  initialValues: IChangePassword = defaultValues,
) => {
  return useForm<IChangePassword>({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });
};
