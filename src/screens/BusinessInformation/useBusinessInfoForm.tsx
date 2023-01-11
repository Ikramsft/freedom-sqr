/**
 * @format
 */
import * as Yup from 'yup';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';

import {
  NAME_REGEX,
  URL_REGEX,
  ZIPCODE_REGEX,
  PHONE_REGEX,
} from '../../constants';
import ErrorMessages from '../../constants/ErrorMessages';
import {IBusinessInfo} from './useBusinessInfo';

export type SocialType = 'facebook' | 'instagram' | 'linkedin' | 'twitter';

export interface IBusinessInfoForm
  extends Omit<
    Partial<IBusinessInfo>,
    | 'socialLinks'
    | 'images'
    | 'step'
    | 'businessCategories'
    | 'status'
    | 'state'
  > {
  businessCategoryIds: string[];
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
}

export const DEFAULT_VALUES: IBusinessInfoForm = {
  documentId: '',
  name: '',
  businessCategoryIds: [],
  address: '',
  city: '',
  zipcode: '',
  stateId: '',
  website: '',
  phone: '',
  onlineOnly: false,
  facebook: '',
  instagram: '',
  linkedin: '',
  twitter: '',
  contactPersonName: '',
  email: '',
  followersCount: '',
  isFollowing: false,
  role: 'owner',
};

const Errors = ErrorMessages.businessInfo;

const SCHEMA = Yup.object().shape({
  name: Yup.string()
    .required(Errors.name.required)
    .min(4, Errors.name.valid)
    .max(75, Errors.name.valid)
    .matches(NAME_REGEX, Errors.name.valid),
  businessCategoryIds: Yup.array().min(1, Errors.category.required),
  contactPersonName: Yup.string()
    .required(Errors.contactPersonName.valid)
    .min(1, Errors.contactPersonName.valid)
    .max(35, Errors.contactPersonName.valid)
    .matches(NAME_REGEX, Errors.contactPersonName.valid),
  email: Yup.string().email(Errors.email.valid).required(Errors.email.required),
  address: Yup.string()
    .required(Errors.address.required)
    .min(5, Errors.address.valid)
    .max(32, Errors.address.valid),
  stateId: Yup.string().required(Errors.state.required),
  city: Yup.string()
    .trim()
    .required(Errors.city.required)
    .min(2, Errors.city.valid)
    .max(36, Errors.city.valid),
  zipcode: Yup.string()
    .required(Errors.zipcode.required)
    .matches(ZIPCODE_REGEX, Errors.zipcode.valid),
  website: Yup.string()
    .required(Errors.website.required)
    .matches(URL_REGEX, Errors.website.valid),
  phone: Yup.string()
    .required(Errors.phone.required)
    .matches(PHONE_REGEX, Errors.phone.required),
});

export const useBusinessInfoForm = (
  initialValues: IBusinessInfoForm = DEFAULT_VALUES,
) => {
  return useForm<IBusinessInfoForm>({
    defaultValues: initialValues,
    resolver: yupResolver(SCHEMA),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });
};
