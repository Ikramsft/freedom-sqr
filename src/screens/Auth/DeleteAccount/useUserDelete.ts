/**
 * @format
 */
import client from 'api';

import {config} from '../../../config/index';
import {showSnackbar} from '../../../utils/SnackBar';
import {ILogin} from '../Login/useLoginForm';
import {useUserLogout} from '../../../redux/user/useUserLogout';
import {useUserInfo} from '../../../hooks/useUserInfo';

export const useUserDelete = () => {
  const {onConfirmLogout} = useUserLogout();

  const {accessToken, refreshToken} = useUserInfo();

  const tryDeleteUser = async (
    values: ILogin,
    callback?: (success: boolean) => void,
  ) => {
    try {
      const url = `${config.USER_API}/users/delete-account`;
      await client.post(url, {...values, accessToken, refreshToken});
      callback?.(true);
      onConfirmLogout();
    } catch (err: any) {
      const msg = err.message || 'Something went wrong';
      showSnackbar({message: msg, type: 'error'});
      callback?.(false);
    }
  };

  return {tryDeleteUser};
};
