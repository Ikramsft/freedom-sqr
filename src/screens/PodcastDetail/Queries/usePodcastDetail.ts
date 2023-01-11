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

async function fetchPodcastDetails(
  podcastShowID: string,
): Promise<IPodcastEpisode | undefined> {
  try {
    const url = `${config.PODCASTS_API_URL}/episode/${podcastShowID}`;
    const response: IResponseData = await client.get(url);
    return response.data[0];
  } catch (error: any) {
    return undefined;
  }
}

const usePodcastDetails = (podcastShowID: string) => {
  const cacheKey = [QueryKeys.podcastDetails, podcastShowID];
  return useQuery(cacheKey, () => fetchPodcastDetails(podcastShowID));
};

export {usePodcastDetails};
