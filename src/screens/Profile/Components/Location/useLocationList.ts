/**
 * @format
 */
import {useQuery} from 'react-query';

import client from 'api';

import {config} from '../../../../config';
import {IRequestMeta} from '../../../../constants';
import {QueryKeys} from '../../../../utils/QueryKeys';
import {ILocation} from '../../../../redux/user/userInterface';

export interface ILocationResponse extends IRequestMeta {
  data: ILocation[];
}

async function fetchLocations(): Promise<ILocation[]> {
  try {
    const url = `${config.USER_API}/states`;
    const response: ILocationResponse = await client.get(url);
    return response.data;
  } catch (error) {
    return [];
  }
}

export const useLocationList = () => {
  const cacheKey = [QueryKeys.locationList];
  return useQuery(cacheKey, () => fetchLocations());
};
