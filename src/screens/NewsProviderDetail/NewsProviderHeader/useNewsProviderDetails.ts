/**
 * @format
 */
import {useQuery} from 'react-query';

import client from 'api';

import {config} from '../../../config';
import {IRequestMeta} from '../../../constants';
import {QueryKeys} from '../../../utils/QueryKeys';

export interface IProviderData extends IRequestMeta {
  documentID: string;
  eTag: string;
  isFollowed: boolean;
  lastModified: string;
  logo: string;
  name: string;
  rss: string;
  slug: string;
  thumbnail: string;
  url: string;
}

export interface IResponseData extends IRequestMeta {
  data: IProviderData;
}

async function fetchuseNewsProviderDetail(
  providerId: string,
): Promise<IProviderData | undefined> {
  try {
    const url = `${config.NEWS_API_URL}/provider/${providerId}`;
    const response: IResponseData = await client.get(url);
    return response.data;
  } catch (error: any) {
    return undefined;
  }
}

const useNewsProviderWallDetails = (providerId = '') => {
  const cacheKey = [QueryKeys.newsProviderWall, providerId];
  return useQuery(cacheKey, () => fetchuseNewsProviderDetail(providerId), {
    enabled: providerId !== '',
  });
};
export {useNewsProviderWallDetails};
