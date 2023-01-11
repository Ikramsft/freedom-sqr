/**
 * @format
 */
import client from 'api';

import {config} from '../../../config/index';
import {showSnackbar} from '../../../utils/SnackBar';
import {IChangePassword} from './useChangePassword';
import {IRequestMeta} from '../../../constants/types';

type IPassword = Omit<IChangePassword, 'confirmPassword'>;
interface IResetPassword {
  newPassword: string;
  token: string;
}

export const useUpdatePassword = () => {
  const tryUpdatePassword = async (
    values: IPassword,
    callback?: (success: boolean) => void,
  ) => {
    try {
      const url = `${config.USER_API}/users/updatePassword`;
      const response: IRequestMeta = await client.post(url, values);
      const msg = response.message || 'Password changed successfully';
      showSnackbar({message: msg, type: 'success'});
      callback?.(true);
    } catch (err: any) {
      const msg = err.message || 'Something went wrong';
      showSnackbar({message: msg, type: 'error'});
      callback?.(false);
    }
  };

  const tryResetPassword = async (
    values: IResetPassword,
    callback?: (success: boolean) => void,
  ) => {
    try {
      const url = `${config.USER_API}/resetPassword`;
      const response: IRequestMeta = await client.post(url, values);
      const msg = response.message || 'Password reset successfully';
      showSnackbar({message: msg, type: 'success'});
      callback?.(true);
    } catch (err: any) {
      const msg = err.message || 'Something went wrong';
      showSnackbar({message: msg, type: 'error'});
      callback?.(false);
    }
  };

  return {tryUpdatePassword, tryResetPassword};
};
