import {useQuery} from 'react-query';

import client from 'api';

import {config} from '../../../config';
import {IRequestMeta} from '../../../constants';
import {IProvider} from '../../../redux/user/userInterface';
import {QueryKeys} from '../../../utils/QueryKeys';
import {IBusinessItem} from '../../BusinessTab/Queries/useBusinessTab';
import {IPodcastsTimelineData} from '../../PodcastTimeLine/Queries/usePodcastChannels';

const RECORD_PER_PAGE = 10;
const PAGE_NUMBER = 1;

export interface IBusinessResponseData extends IRequestMeta {
  data: IBusinessItem[];
  error: boolean;
  message: string;
  status: number;
}

export interface IPodcastResponseData extends IRequestMeta {
  data: IPodcastsTimelineData[];
  error: boolean;
  message: string;
  status: number;
}

export interface IProviderResponseData extends IRequestMeta {
  data: IProvider[];
  error: boolean;
  message: string;
  status: number;
}

async function fetchBusiness(): Promise<IBusinessItem[]> {
  try {
    const url = `${config.BUSINESS_TAB_URL}/businesses?limit=${RECORD_PER_PAGE}&offset=${PAGE_NUMBER}&isFeatured=false&type=all`;
    const response: IBusinessResponseData = await client.get(url);
    return response.data;
  } catch (error: any) {
    return [];
  }
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

async function fetchProviders(): Promise<IProvider[]> {
  try {
    const url = `${config.NEWS_API_URL}/providers?limit=${RECORD_PER_PAGE}&offset=0`;
    const response: IProviderResponseData = await client.get(url);
    return response.data;
  } catch (error: any) {
    return [];
  }
}

const useBusiness = (enabled = false) => {
  const cacheKey = [QueryKeys.preferenceBusinessList];
  return useQuery(cacheKey, () => fetchBusiness(), {enabled});
};

const usePodcasts = (enabled = false) => {
  const cacheKey = [QueryKeys.preferencePodcastsList];
  return useQuery(cacheKey, () => fetchPodcasts(), {enabled});
};

const useProviders = (enabled = false) => {
  const cacheKey = [QueryKeys.preferenceProvidersList];
  return useQuery(cacheKey, () => fetchProviders(), {enabled});
};

export {usePodcasts, useBusiness, useProviders};
