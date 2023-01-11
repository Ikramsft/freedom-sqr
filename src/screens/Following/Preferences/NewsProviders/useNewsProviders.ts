/**
 * @format
 */
import {useQuery} from 'react-query';

import client from 'api';

import {config} from '../../../../config';
import {IRequestMeta} from '../../../../constants';
import {IProvider} from '../../../../redux/user/userInterface';
import {QueryKeys} from '../../../../utils/QueryKeys';

const RECORD_PER_PAGE = 10;

export interface IProviderResponseData extends IRequestMeta {
  data: IProvider[];
  error: boolean;
  message: string;
  status: number;
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

const useNews = () => {
  const cacheKey = [QueryKeys.preferenceProvidersList];
  return useQuery(cacheKey, () => fetchProviders());
};

export {useNews};
