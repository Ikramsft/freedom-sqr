/**
 * @format
 */
import {useForm} from 'react-hook-form';

export type SocialType = 'facebook' | 'instagram' | 'linkedin' | 'twitter';

export interface IBusinessLinksForm {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  documentId: string;
}

export const defaultValues: IBusinessLinksForm = {
  facebook: '',
  instagram: '',
  linkedin: '',
  twitter: '',
  documentId: '',
};

export const useBusinessLinksForm = (
  initialValues: IBusinessLinksForm = defaultValues,
) => {
  return useForm<IBusinessLinksForm>({
    defaultValues: initialValues,
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });
};
