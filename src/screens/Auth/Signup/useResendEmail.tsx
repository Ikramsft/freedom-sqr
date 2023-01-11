/**
 * @format
 */
import client from 'api';

import {config} from '../../../config/index';
import {showSnackbar} from '../../../utils/SnackBar';
import {IRequestMeta} from '../../../constants';
import {IEmail} from '../ForgotPassword/usePasswordForm';

export interface IResendEmail extends IRequestMeta {
  data: null;
}

export const useResendEmail = () => {
  const tryResendVerificationEmail = async (
    params: IEmail,
    callback?: (success: boolean) => void,
  ) => {
    try {
      const url = `${config.USER_API}/users/email/verify`;
      const response: IResendEmail = await client.post(url, params);
      callback?.(true);
      showSnackbar({message: response.message, type: 'success'});
    } catch (err: any) {
      const msg = err.message || 'Something went wrong';
      showSnackbar({message: msg, type: 'error'});
      callback?.(false);
    }
  };

  const tryResendResetEmail = async (
    params: IEmail,
    callback?: (success: boolean) => void,
  ) => {
    try {
      const url = `${config.USER_API}/sendResetPassword`;
      const response: IResendEmail = await client.post(url, params);
      callback?.(true);
      showSnackbar({message: response.message, type: 'success'});
    } catch (err: any) {
      const msg = err.message || 'Something went wrong';
      showSnackbar({message: msg, type: 'error'});
      callback?.(false);
    }
  };

  return {tryResendVerificationEmail, tryResendResetEmail};
};
