/**
 * @format
 */
import {useQuery} from 'react-query';

import client from 'api';

import {config} from '../../../config';
import {IRequestMeta} from '../../../constants';
import {QueryKeys} from '../../../utils/QueryKeys';

export interface IState {
  documentId: string;
  name: string;
}

export interface IStateListResponse extends IRequestMeta {
  data: IState[];
}

async function fetchStates(): Promise<IState[]> {
  try {
    const url = `${config.BUSINESS_API_URL}/states`;
    const response: IStateListResponse = await client.get(url);
    return response.data;
  } catch (error) {
    return [];
  }
}

export const useStatesList = () => {
  const cacheKey = [QueryKeys.stateList];
  return useQuery(cacheKey, () => fetchStates());
};
