/**
 * @format
 */
import {useQuery} from 'react-query';

import client from 'api';

import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';
import {IRequestMeta} from '../../../constants/types';
import {INewsData} from '../Queries/useNewsFeed';

export interface IResponseData extends IRequestMeta {
  data: INewsData[];
}

async function fetchFeaturedNews(): Promise<INewsData[]> {
  try {
    const url = `${config.NEWS_API_URL}/featured/news?page=1&limit=6`;
    const response: IResponseData = await client.get(url);
    return response.data ?? [];
  } catch (error: any) {
    return [];
  }
}

const useFeaturedNews = () => {
  const cacheKey = [QueryKeys.featuredNews];
  return useQuery(cacheKey, () => fetchFeaturedNews());
};

export {useFeaturedNews};
