/**
 * @format
 */
import * as Yup from 'yup';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';

import {ILogin} from '../Login/useLoginForm';
import ErrorMessages from '../../../constants/ErrorMessages';

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

export const useDeleteForm = (initialValues: ILogin = defaultValues) => {
  return useForm<ILogin>({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });
};
