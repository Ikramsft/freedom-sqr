/**
 * @format
 */
import client from 'api';

import {config} from '../../../config/index';
import {showSnackbar} from '../../../utils/SnackBar';
import {IRequestMeta} from '../../../constants/types';

export const useArticleFollowActions = () => {
  const tryFollowProvider = async (
    providerID: string,
    callback?: (success: boolean) => void,
  ) => {
    try {
      const url = `${config.NEWS_API_URL}/users/news/providers/follow`;
      const response: IRequestMeta = await client.post(url, {providerID});
      const msg = response.message || 'Follow Successfull!';
      showSnackbar({message: msg, type: 'success'});
      callback?.(true);
    } catch (err: any) {
      const msg = err.message || 'Something went wrong';
      showSnackbar({message: msg, type: 'error'});
      callback?.(false);
    }
  };

  const tryUnfollowProvider = async (
    providerID: string,
    callback?: (success: boolean) => void,
  ) => {
    try {
      const url = `${config.NEWS_API_URL}/users/news/providers/${providerID}/unfollow`;
      const response: IRequestMeta = await client.delete(url, {});
      const msg = response.message || 'Unfollow Successfully!';
      showSnackbar({message: msg, type: 'success'});
      callback?.(true);
    } catch (err: any) {
      const msg = err.message || 'Something went wrong';
      showSnackbar({message: msg, type: 'error'});
      callback?.(false);
    }
  };

  return {tryFollowProvider, tryUnfollowProvider};
};
