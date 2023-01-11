/**
 * @format
 */
import * as Yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm} from 'react-hook-form';

import client from 'api';

import {PASS_REGEX} from '../../../constants';
import {IRequestMeta} from '../../../constants/types';
import {config} from '../../../config';
import ErrorMessages from '../../../constants/ErrorMessages';

export interface IPassword {
  password: string;
  confirmPassword: string;
}

const defaultValues: IPassword = {
  password: '',
  confirmPassword: '',
};

const Errors = ErrorMessages.password;

const schema = Yup.object().shape({
  password: Yup.string()
    .required(Errors.valid)
    .matches(PASS_REGEX, Errors.valid),
  confirmPassword: Yup.string()
    .required(Errors.match)
    .oneOf([Yup.ref('password'), null], Errors.match),
});

export const useResetForm = (initialValues: IPassword = defaultValues) => {
  return useForm<IPassword>({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });
};

interface IVerifyTokenResponse extends IRequestMeta {
  data: {
    email?: string;
  };
}

export const verifyEmailValidity = async (token: string) => {
  try {
    const url = `${config.USER_API}/verify/email`;
    const response: IVerifyTokenResponse = await client.post(url, {token});
    return response.data;
  } catch (error: unknown) {
    return Promise.reject(error);
  }
};

export const verifyTokenValidity = async (token: string) => {
  try {
    const url = `${config.USER_API}/verify/emailToken/${token}`;
    const response: IVerifyTokenResponse = await client.get(url);
    return response.data;
  } catch (error: unknown) {
    return Promise.reject(error);
  }
};
