/**
 * @format
 */
import * as Yup from 'yup';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';

import ErrorMessages from '../../../constants/ErrorMessages';
import {USERNAME_REGEX} from '../../../constants';

export interface IProfileForm {
  email: string;
  validEmail?: boolean;
  userName: string;
  validUsername?: boolean;
}

const defaultValues: IProfileForm = {
  email: '',
  userName: '',
};

const Errors = ErrorMessages.signup;

const schema = Yup.object().shape({
  email: Yup.string().email(Errors.email).required(Errors.email),
  userName: Yup.string()
    .required(Errors.userName)
    .min(4, Errors.userName)
    .matches(USERNAME_REGEX, Errors.userName),
});

export const useProfileForm = (initialValues: IProfileForm = defaultValues) => {
  return useForm<IProfileForm>({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });
};
