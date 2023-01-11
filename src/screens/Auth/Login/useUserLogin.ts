/**
 * @format
 */
import {useQueryClient} from 'react-query';

import client from 'api';

import {IRequestMeta, storage, StorageKeys} from '../../../constants';
import {IUser} from '../../../redux/user/userInterface';
import {config} from '../../../config/index';
import {showSnackbar} from '../../../utils/SnackBar';
import {useUserActions} from '../../../redux/user';
import {ILogin} from './useLoginForm';
import ErrorMessages from '../../../constants/ErrorMessages';
import {QueryKeys} from '../../../utils/QueryKeys';
import {useAffiliateActions} from '../../CheckAffiliate/useAffiliateActions';

export interface ILoginResponse extends IRequestMeta {
  data: {
    accessToken: string;
    refreshToken: string;
    isFirstLogin: boolean;
    user: IUser;
  };
}

export type LoginCallbackParams = {
  values: ILogin;
  success?: boolean;
  redirectToBusiness?: boolean;
  redirectToVerify?: boolean;
};

export const useUserLogin = () => {
  const queryClient = useQueryClient();

  const {setUserInfo} = useUserActions();

  const {linkAffiliate} = useAffiliateActions();

  const linkAffiliateById = () => {
    const affiliateId = storage.getString(StorageKeys.AFFILIATE_ID) ?? '';
    if (affiliateId.length > 0) {
      linkAffiliate(affiliateId);
    }
  };

  const resetCache = () => {
    queryClient.invalidateQueries([QueryKeys.featuredBusiness]);
    queryClient.invalidateQueries([QueryKeys.recentBusiness]);
    queryClient.invalidateQueries([QueryKeys.allBusiness]);
  };

  const tryLogin = async (
    values: ILogin,
    callback?: (params?: LoginCallbackParams) => void,
  ) => {
    try {
      const url = `${config.USER_API}/login`;
      const response: ILoginResponse = await client.post(url, values);
      setUserInfo({...response.data, authenticated: true});
      const {isFirstLogin, user} = response.data;
      const redirectToBusiness = isFirstLogin && user.type === 'business';
      if (redirectToBusiness) {
        linkAffiliateById();
      }
      callback?.({success: true, redirectToBusiness, values});
      resetCache();
    } catch (err: any) {
      const msg =
        err?.status === 404
          ? ErrorMessages.login.wrongCredentials
          : err.message || 'Something went wrong';
      showSnackbar({message: msg, type: 'error'});
      const redirectToVerify = err.status === 406;
      callback?.({redirectToVerify, values});
    }
  };

  return {tryLogin};
};
