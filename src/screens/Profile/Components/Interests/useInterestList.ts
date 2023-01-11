/**
 * @format
 */
import {useQuery} from 'react-query';

import client from 'api';

import {config} from '../../../../config';
import {IRequestMeta} from '../../../../constants';
import {IInterest} from '../../../../redux/user/userInterface';
import {QueryKeys} from '../../../../utils/QueryKeys';

export interface IInterestResponse extends IRequestMeta {
  data: IInterest[];
}

async function fetchInterests(): Promise<IInterest[]> {
  try {
    const url = `${config.USER_API}/interests`;
    const response: IInterestResponse = await client.get(url);
    return response.data;
  } catch (error) {
    return [];
  }
}

export const useInterestList = () => {
  const cacheKey = [QueryKeys.interestList];
  return useQuery(cacheKey, () => fetchInterests());
};
