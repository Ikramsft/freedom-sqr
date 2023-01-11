/**
 * @format
 */
import {useMutation} from 'react-query';

import client from 'api';

import {IFirstLogin} from '../../../components/FirstLoginPopup/useFirstLoginForm';
import {showSnackbar} from '../../../utils/SnackBar';
import {config} from '../../../config';
import {IProfileResponse} from '../../../redux/user';
import {IProfileForm} from './useProfileForm';
import {omitFields} from '../../../utils';

type RequestType = {
  values: IProfileForm | IFirstLogin;
  callback?: (success: boolean) => void;
};

export const useUpdateEmail = () => {
  async function updateEmail(data: RequestType) {
    try {
      const values = omitFields(data.values, ['validEmail']);
      const url = `${config.USER_API}/users/updateEmail`;
      const userInfo: IProfileResponse = await client.post(url, values);
      const newResponse = {...userInfo.data, email: values.email};
      return Promise.resolve(newResponse);
    } catch (error: any) {
      return Promise.reject(error);
    }
  }

  const updateEmailMutation = useMutation(updateEmail, {
    onSuccess: (data, variables) => {
      const {callback} = variables;
      callback?.(true);
      const message =
        'Please check your email to complete the changes made to your account';
      showSnackbar({message, type: 'success'});
    },
    onError: (error: any, variables) => {
      const {callback} = variables;
      const message = error.message ?? 'Something went wrong';
      showSnackbar({message, type: 'error'});
      callback?.(false);
    },
  });

  const tryUpdateEmail = (data: RequestType) =>
    updateEmailMutation.mutate(data);

  return {
    ...updateEmailMutation,
    tryUpdateEmail,
  };
};
