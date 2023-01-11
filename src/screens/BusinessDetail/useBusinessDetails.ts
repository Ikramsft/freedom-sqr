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

async function fetchBusinessDetail(
  businessId: string,
): Promise<IBusinessInfo | undefined> {
  try {
    const url = `${config.BUSINESS_API_URL}/business/${businessId}`;
    const response: IResponseData = await client.get(url);
    return response.data;
  } catch (error: any) {
    return undefined;
  }
}

const useBusinessDetails = (businessId = '') => {
  const cacheKey = [QueryKeys.businessDetails, businessId];
  return useQuery(cacheKey, () => fetchBusinessDetail(businessId), {
    enabled: businessId !== '',
  });
};

export {useBusinessDetails};
