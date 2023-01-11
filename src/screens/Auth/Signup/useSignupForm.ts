/**
 * @format
 */
import * as Yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm} from 'react-hook-form';

import ErrorMessages from '../../../constants/ErrorMessages';
import {PASS_REGEX, USERNAME_REGEX} from '../../../constants';
import {UserType} from '../../../redux/user/userInterface';

export interface ISignup {
  userType: UserType;
  email: string;
  userName: string;
  password: string;
  repeatPassword: string;
  tncAccepted: boolean;
  privacyPolicyAccepted: boolean;
}

const defaultValues: ISignup = {
  userName: '',
  email: '',
  password: '',
  repeatPassword: '',
  tncAccepted: false,
  userType: 'individual',
  privacyPolicyAccepted: true,
};

const Errors = ErrorMessages.signup;

export const schema = Yup.object().shape({
  userName: Yup.string()
    .required(Errors.userName)
    .min(4, Errors.userName)
    .matches(USERNAME_REGEX, Errors.userName),
  email: Yup.string().email(Errors.email).required(Errors.email),
  password: Yup.string()
    .required(Errors.password)
    .matches(PASS_REGEX, Errors.password),
  repeatPassword: Yup.string()
    .required(Errors.repeatPassword)
    .oneOf([Yup.ref('password'), null], Errors.repeatPassword),
  tncAccepted: Yup.boolean().oneOf(
    [true],
    'Please accept the Terms & Conditions',
  ),
});

export const useSignupForm = (initialValues: ISignup = defaultValues) => {
  return useForm<ISignup>({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });
};
