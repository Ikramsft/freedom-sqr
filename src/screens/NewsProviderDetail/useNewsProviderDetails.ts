/**
 * @format
 */
import {useQuery} from 'react-query';

import client from 'api';

import {config} from '../../config';
import {QueryKeys} from '../../utils/QueryKeys';
import {IRequestMeta} from '../../constants/types';
import {IBusinessInfo} from '../BusinessInformation/useBusinessInfo';

export interface IResponseData extends IRequestMeta {
  data: IBusinessInfo;
}

async function fetchuseNewsProviderDetail(
  businessId: string,
): Promise<IBusinessInfo | undefined> {
  try {
    const url = `${config.NEWS_API_URL}/news/${businessId}`;
    const response: IResponseData = await client.get(url);
    return response.data;
  } catch (error: any) {
    return undefined;
  }
}

const useNewsProviderDetails = (providerId = '') => {
  const cacheKey = [QueryKeys.businessDetails, providerId];
  return useQuery(cacheKey, () => fetchuseNewsProviderDetail(providerId), {
    enabled: providerId !== '',
  });
};
export {useNewsProviderDetails};
