/**
 * @format
 */
import {useQuery} from 'react-query';

import client from 'api';

import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';
import {IRequestMeta} from '../../../constants/types';

export interface IResponseData extends IRequestMeta {
  data: IPodcastDetails;
}

export interface IPodcastDetails {
  documentID: string;
  episodeCount: number;
  externalID: string;
  externalShowDescription: string;
  externalShowImages: IPodcastImage[];
  externalShowLink: string;
  externalShowName: string;
  name: string;
  type: string;
}

export interface IPodcastImage {
  height: number;
  width: number;
  url: string;
}

async function fetchPodcastData(
  podcastID: string,
): Promise<IPodcastDetails | undefined> {
  try {
    const url = `${config.PODCASTS_API_URL}/podcasts/${podcastID}`;
    const response: IResponseData = await client.get(url);
    return response.data;
  } catch (error: any) {
    return undefined;
  }
}

const usePodcastData = (podcastID: string) => {
  const cacheKey = [QueryKeys.podcastData, podcastID];
  return useQuery(cacheKey, () => fetchPodcastData(podcastID));
};

export {usePodcastData};
