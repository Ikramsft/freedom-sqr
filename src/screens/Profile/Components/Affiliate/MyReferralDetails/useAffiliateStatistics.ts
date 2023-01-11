/**
 * @format
 */
import {useQuery} from 'react-query';

import client from 'api';

import {config} from '../../../../../config';
import {QueryKeys} from '../../../../../utils/QueryKeys';
import {IRequestMeta} from '../../../../../constants/types';

interface IAffiliateStatistics {
  businessCount: number;
  clicks: number;
  registers: number;
  userInfo: {
    email: string;
    userId: string;
    userName: string;
  };
}

export interface IResponseData extends IRequestMeta {
  data: IAffiliateStatistics;
}

export type RequestType = {
  userId: string;
  from?: string;
  to?: string;
};

async function fetchStatistics(
  info: RequestType,
): Promise<IAffiliateStatistics | null> {
  try {
    const {userId, from, to} = info;
    const url = `${config.AFFILIATE_API_URL}/${userId}?from=${from}&to=${to}`;
    const response: IResponseData = await client.get(url);
    return response.data ?? [];
  } catch (error: any) {
    return null;
  }
}

const useAffiliateStatistics = (info: RequestType) => {
  const cacheKey = [QueryKeys.affiliateStatistics];
  return useQuery(cacheKey, () => fetchStatistics(info), {enabled: false});
};

export {useAffiliateStatistics};
