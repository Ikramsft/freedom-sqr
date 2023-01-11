/**
 * @format
 */
import * as Yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm} from 'react-hook-form';

export interface IEmail {
  email: string;
}

const defaultValues: IEmail = {
  email: '',
};

const schema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Please enter email address'),
});

export const usePasswordForm = (initialValues: IEmail = defaultValues) => {
  return useForm<IEmail>({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });
};
