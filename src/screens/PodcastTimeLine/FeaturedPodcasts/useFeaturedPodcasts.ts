/**
 * @format
 */
import {useQuery} from 'react-query';

import client from 'api';

import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';
import {IRequestMeta} from '../../../constants/types';
import {IPodcastEpisode} from '../../PodcastsChannel/Queries/usePodcastsEpisodes';

export interface IResponseData extends IRequestMeta {
  data: IPodcastEpisode[];
}

async function fetchFeaturedPosts(): Promise<IPodcastEpisode[]> {
  try {
    const url = `${config.PODCASTS_API_URL}/featured`;
    const response: IResponseData = await client.get(url);
    return response.data ?? [];
  } catch (error: any) {
    return [];
  }
}

const useFeaturedPodcasts = () => {
  const cacheKey = [QueryKeys.featuredPodcasts];
  return useQuery(cacheKey, () => fetchFeaturedPosts());
};

export {useFeaturedPodcasts};
