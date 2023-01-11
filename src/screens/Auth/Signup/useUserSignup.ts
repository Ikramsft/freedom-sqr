/**
 * @format
 */

import client from 'api';

import {IRequestMeta} from '../../../constants';
import {IUser} from '../../../redux/user/userInterface';
import {config} from '../../../config/index';
import {showSnackbar} from '../../../utils/SnackBar';
import {useUserActions} from '../../../redux/user';
import {ISignup} from './useSignupForm';
import {omitFields} from '../../../utils';
import {useAffiliateActions} from '../../CheckAffiliate/useAffiliateActions';

export interface ISignupResponse extends IRequestMeta {
  data: {
    accessToken: string;
    user: IUser;
  };
}

interface ExistAttributes {
  emailExists: boolean;
  userNameExists: boolean;
}

export interface IExistResponse extends IRequestMeta {
  data: ExistAttributes;
}

export type ISignupRequest = ISignup & {affiliateUserId?: string};

export const useUserSignup = () => {
  const {setUserInfo} = useUserActions();

  const {clearAffiliateStorageInfo} = useAffiliateActions();

  const tryRegister = async (
    values: ISignupRequest,
    callback?: (success: boolean) => void,
  ) => {
    const register = omitFields(values, [
      'repeatPassword',
      'validEmail',
      'validUsername',
    ]);
    try {
      const url = `${config.USER_API}/signup`;

      const response: ISignupResponse = await client.post(url, register);
      showSnackbar({message: 'Registered successfully', type: 'success'});
      setUserInfo({...response.data, authenticated: false});
      callback?.(true);

      clearAffiliateStorageInfo();
    } catch (err: any) {
      const msg = err.message || 'Something went wrong';
      showSnackbar({message: msg, type: 'error'});
      callback?.(false);
    }
  };

  const tryValidateUsername = async (userName: string) => {
    try {
      const url = `${config.USER_API}/users/exists?userName=${userName}`;
      const res: IExistResponse = await client.get(url);
      return !res.data.userNameExists;
    } catch (err: any) {
      return !err.error;
    }
  };

  const tryValidateEmail = async (email: string) => {
    const encodedEmail = encodeURIComponent(email);
    try {
      const url = `${config.USER_API}/users/exists?email=${encodedEmail}`;
      const res: IExistResponse = await client.get(url);
      return !res.data.emailExists;
    } catch (err: any) {
      return !err.error;
    }
  };

  const tryCheckUserExists = async (
    query: string,
  ): Promise<ExistAttributes> => {
    try {
      const url = `${config.USER_API}/users/exists?${query}`;
      const response: IExistResponse = await client.get(url);
      return response.data;
    } catch (error) {
      return {
        emailExists: false,
        userNameExists: false,
      };
    }
  };

  return {
    tryRegister,
    tryValidateUsername,
    tryValidateEmail,
    tryCheckUserExists,
  };
};
