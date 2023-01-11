/**
 * @format
 */
import client from 'api';

import {config} from '../../../config/index';
import {showSnackbar} from '../../../utils/SnackBar';
import {IRequestMeta} from '../../../constants/types';

export const usePodcastFollowActions = () => {
  const tryFollowPodcast = async (
    podcastID: string,
    callback?: (success: boolean) => void,
  ) => {
    try {
      const url = `${config.PODCASTS_API_URL}/podcasts/follow/${podcastID}`;
      const response: IRequestMeta = await client.post(url, {});
      const msg = response.message || 'Follow Successfull!';
      showSnackbar({message: msg, type: 'success'});
      callback?.(true);
    } catch (err: any) {
      const msg = err.message || 'Something went wrong';
      showSnackbar({message: msg, type: 'error'});
      callback?.(false);
    }
  };

  const tryUnfollowPodcast = async (
    podcastID: string,
    callback?: (success: boolean) => void,
  ) => {
    try {
      const url = `${config.PODCASTS_API_URL}/podcasts/follow/${podcastID}`;
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

  return {tryFollowPodcast, tryUnfollowPodcast};
};
