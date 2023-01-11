/**
 * @format
 */
import * as Yup from 'yup';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';

import ErrorMessages from '../../../constants/ErrorMessages';

export interface ILogin {
  email: string;
  password: string;
}

const defaultValues: ILogin = {
  email: '',
  password: '',
};

const errors = ErrorMessages.login;

const schema = Yup.object().shape({
  email: Yup.string()
    .email(errors.email.invalid)
    .required(errors.email.required),
  password: Yup.string().required(errors.password),
});

export const useLoginForm = (initialValues: ILogin = defaultValues) => {
  return useForm<ILogin>({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });
};
