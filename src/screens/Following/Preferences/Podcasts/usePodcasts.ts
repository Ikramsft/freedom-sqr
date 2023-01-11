/**
 * @format
 */
import {useQuery} from 'react-query';

import client from 'api';

import {config} from '../../../../config';
import {IRequestMeta} from '../../../../constants';
import {QueryKeys} from '../../../../utils/QueryKeys';
import {IPodcastsTimelineData} from '../../../PodcastTimeLine/Queries/usePodcastChannels';

const RECORD_PER_PAGE = 10;

export interface IPodcastResponseData extends IRequestMeta {
  data: IPodcastsTimelineData[];
  error: boolean;
  message: string;
  status: number;
}

async function fetchPodcasts(): Promise<IPodcastsTimelineData[]> {
  try {
    const url = `${config.PODCASTS_API_URL}/podcasts?limit=${RECORD_PER_PAGE}&offset=0`;
    const response: IPodcastResponseData = await client.get(url);
    return response.data;
  } catch (error: any) {
    return [];
  }
}

const usePodcasts = () => {
  const cacheKey = [QueryKeys.preferencePodcastsList];
  return useQuery(cacheKey, () => fetchPodcasts());
};

export {usePodcasts};
