import {useQueryClient} from 'react-query';

import client from 'api';

import {config} from '../../../config/index';
import {showSnackbar} from '../../../utils/SnackBar';
import {IRequestMeta} from '../../../constants/types';
import {QueryKeys} from '../../../utils/QueryKeys';
import {IProvider} from '../../../redux/user/userInterface';
import {IBusinessItem} from '../../BusinessTab/Queries/useBusinessTab';
import {IPodcastsTimelineData} from '../../PodcastTimeLine/Queries/usePodcastChannels';

export const usePreferencesActions = () => {
  const queryClient = useQueryClient();

  const toggleBusinessList = async (businessIds: string[]) => {
    try {
      const cacheKey = [QueryKeys.preferenceBusinessList];
      const businessList = await queryClient.getQueryData<IBusinessItem[]>(
        cacheKey,
      );
      if (businessList) {
        const updatedBusinessList = businessList.map(
          (business: IBusinessItem) => {
            return {
              ...business,
              isFollowing: businessIds.includes(business.documentId),
            };
          },
        );
        queryClient.setQueryData<IBusinessItem[]>(
          cacheKey,
          updatedBusinessList,
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const togglePodcastList = async (podcastIds: string[]) => {
    try {
      const cacheKey = [QueryKeys.preferencePodcastsList];
      const podcastsList = await queryClient.getQueryData<
        IPodcastsTimelineData[]
      >(cacheKey);
      if (podcastsList) {
        const updatedPodcastsList = podcastsList.map(
          (podcast: IPodcastsTimelineData) => {
            return {
              ...podcast,
              isFollowed: podcastIds.includes(podcast.documentId),
            };
          },
        );
        queryClient.setQueryData<IPodcastsTimelineData[]>(
          cacheKey,
          updatedPodcastsList,
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleProviderList = async (providerIDs: string) => {
    try {
      const cacheKey = [QueryKeys.preferenceProvidersList];
      const providersList = await queryClient.getQueryData<IProvider[]>(
        cacheKey,
      );
      if (providersList) {
        const updatedProvidersList = providersList.map(
          (provider: IProvider) => {
            return {
              ...provider,
              isFollowed: providerIDs.includes(provider.documentID),
            };
          },
        );
        queryClient.setQueryData<IProvider[]>(cacheKey, updatedProvidersList);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateFollowedBusiness = async (
    businessIds: string[],
    callback?: (success: boolean) => void,
  ) => {
    try {
      const url = `${config.BUSINESS_API_URL}/businesses/follow`;
      const response: IRequestMeta = await client.put(url, {
        businessIds,
      });
      toggleBusinessList(businessIds);
      const msg = response.message || 'Updated Preferences Successfully!';
      showSnackbar({message: msg, type: 'success'});
      queryClient.invalidateQueries([QueryKeys.preferenceBusinessList]);
      callback?.(true);
    } catch (err: any) {
      const msg = err.message || 'Something went wrong';
      showSnackbar({message: msg, type: 'error'});
      callback?.(false);
    }
  };

  const updateFollowedPodcasts = async (
    podcastIDs: string[],
    callback?: (success: boolean) => void,
  ) => {
    try {
      const url = `${config.PODCASTS_API_URL}/podcasts/follow`;
      const response: IRequestMeta = await client.put(url, {
        podcastIDs,
      });
      togglePodcastList(podcastIDs);
      const msg = response.message || 'Updated Preferences Successfully!';
      showSnackbar({message: msg, type: 'success'});
      queryClient.invalidateQueries([QueryKeys.preferencePodcastsList]);
      callback?.(true);
    } catch (err: any) {
      const msg = err.message || 'Something went wrong';
      showSnackbar({message: msg, type: 'error'});
      callback?.(false);
    }
  };

  const updateFollowedProviders = async (
    providerIDs: string[],
    callback?: (success: boolean) => void,
  ) => {
    try {
      const url = `${config.NEWS_API_URL}/users/news/providers`;
      const response: IRequestMeta = await client.put(url, {
        providerIDs,
      });
      toggleProviderList(providerIDs);
      const msg = response.message || 'Updated Preferences Successfully!';
      showSnackbar({message: msg, type: 'success'});
      queryClient.invalidateQueries([QueryKeys.preferenceProvidersList]);
      callback?.(true);
    } catch (err: any) {
      const msg = err.message || 'Something went wrong';
      showSnackbar({message: msg, type: 'error'});
      callback?.(false);
    }
  };

  return {
    updateFollowedBusiness,
    updateFollowedPodcasts,
    updateFollowedProviders,
  };
};
