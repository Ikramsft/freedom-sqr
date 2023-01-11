/**
 * @format
 */
import {useQuery} from 'react-query';

import client from 'api';

import {config} from '../../../../config';
import {IRequestMeta} from '../../../../constants';
import {IProvider} from '../../../../redux/user/userInterface';

import {QueryKeys} from '../../../../utils/QueryKeys';

export interface IProviderResponse extends IRequestMeta {
  data: IProvider[];
}

async function fetchProviders(): Promise<IProvider[]> {
  try {
    const url = `${config.NEWS_API_URL}/providers`;
    const response: IProviderResponse = await client.get(url);
    return response.data;
  } catch (error) {
    return [];
  }
}

export const useProviderList = () => {
  const cacheKey = [QueryKeys.providerList];
  return useQuery(cacheKey, () => fetchProviders());
};

async function fetchUsersProviders(): Promise<IProvider[]> {
  try {
    const url = `${config.NEWS_API_URL}/users/providers`;
    const response: IProviderResponse = await client.get(url);
    return response.data;
  } catch (error) {
    return [];
  }
}

export const useUserProviderList = () => {
  const cacheKey = [QueryKeys.usersProviderList];
  return useQuery(cacheKey, () => fetchUsersProviders());
};
