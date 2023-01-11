/**
 * @format
 */
import * as Yup from 'yup';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';

import {USERNAME_REGEX} from '../../constants';
import ErrorMessages from '../../constants/ErrorMessages';

const Errors = ErrorMessages.signup;

export interface IFirstLogin {
  userName: string;
  validUsername?: boolean;
}

const defaultValues: IFirstLogin = {
  userName: '',
};

const schema = Yup.object().shape({
  userName: Yup.string()
    .required(Errors.userName)
    .min(4, Errors.userName)
    .matches(USERNAME_REGEX, Errors.userName),
});

export const useFirstLoginForm = (
  initialValues: IFirstLogin = defaultValues,
) => {
  return useForm<IFirstLogin>({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });
};
