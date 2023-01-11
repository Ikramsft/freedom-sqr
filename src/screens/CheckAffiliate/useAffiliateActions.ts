/**
 * @format
 */
import {Platform} from 'react-native';

import client from 'api';

import {config} from '../../config';
import {storage, StorageKeys} from '../../constants';
import {getUserProfile} from '../../redux/user/index';
import {useAppDispatch} from '../../redux/store';
import {IRequestMeta} from '../../constants/types';

const useAffiliateActions = () => {
  const dispatch = useAppDispatch();

  const linkAffiliate = async (affiliateUserId: string) => {
    try {
      const url = `${config.USER_API}/users/affiliate`;
      const response: IRequestMeta = await client.post(url, {affiliateUserId});
      dispatch(getUserProfile());
      clearAffiliateStorageInfo();
      return response;
    } catch (error: unknown) {
      return error;
    }
  };

  const addAffiliateClickEvent = async (affiliateUserId: string) => {
    try {
      const url = `${config.AFFILIATE_API_URL}/clicks`;
      const response: IRequestMeta = await client.post(url, {
        affiliateUserId,
        type: Platform.OS,
      });
      return response;
    } catch (error: unknown) {
      return error;
    }
  };

  const setAffiliateDataInStorage = (affiliateId: string) => {
    const currentId = storage.getString(StorageKeys.AFFILIATE_ID) ?? '';
    if (!currentId.length) {
      storage.set(StorageKeys.AFFILIATE_ID, affiliateId);
      storage.set(StorageKeys.IS_AFFILIATE, true);
    }
  };

  const clearAffiliateStorageInfo = () => {
    storage.delete(StorageKeys.AFFILIATE_ID);
    storage.delete(StorageKeys.IS_AFFILIATE);
  };

  const getAffiliateStorageInfo = () => {
    const affiliateId = storage.getString(StorageKeys.AFFILIATE_ID);
    const isAffiliate = storage.getBoolean(StorageKeys.IS_AFFILIATE);
    return {
      affiliateId,
      isAffiliate,
    };
  };

  return {
    linkAffiliate,
    addAffiliateClickEvent,
    getAffiliateStorageInfo,
    setAffiliateDataInStorage,
    clearAffiliateStorageInfo,
  };
};

export {useAffiliateActions};
