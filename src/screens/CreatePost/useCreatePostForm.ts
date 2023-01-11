/**
 * @format
 */
import * as Yup from 'yup';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';

export interface IMedia {
  uri: string;
  name: string;
  type: string;
  height?: number;
  width?: number;
}

export interface IPostForm {
  textContent: string;
  mediaContent: IMedia | undefined;
}

const defaultValues: IPostForm = {
  textContent: '',
  mediaContent: undefined,
};

const schema = Yup.object().shape({
  textContent: Yup.string(),
});

export const useCreatePostForm = (initialValues: IPostForm = defaultValues) => {
  return useForm<IPostForm>({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });
};
