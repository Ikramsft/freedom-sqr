/**
 * @format
 */
import * as Yup from 'yup';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';

import ErrorMessages from '../../constants/ErrorMessages';
import {IBusinessLinksForm} from './useBusinessLinksForm';

export interface IBusinessDetailForm extends IBusinessLinksForm {
  tagline: string;
  description: string;
  documentId: string;
}

export const defaultValues: IBusinessDetailForm = {
  tagline: '',
  description: '',
  documentId: '',
};

const Errors = ErrorMessages.businessInfo;

const schema = Yup.object().shape({
  tagline: Yup.string()
    .min(20, Errors.tagline.min)
    .required(Errors.tagline.required)
    .max(100, Errors.tagline.valid),
  description: Yup.string()
    .min(100, Errors.description.min)
    .required(Errors.description.required)
    .max(1000, Errors.description.valid),
});

export const useBusinessDetailForm = (
  initialValues: IBusinessDetailForm = defaultValues,
) => {
  return useForm<IBusinessDetailForm>({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });
};
