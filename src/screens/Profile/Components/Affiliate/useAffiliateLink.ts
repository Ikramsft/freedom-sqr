/**
 * @format
 */
import {useQuery} from 'react-query';

import client from 'api';

import {config} from '../../../../config';
import {QueryKeys} from '../../../../utils/QueryKeys';
import {IRequestMeta} from '../../../../constants/types';

export interface IResponseData extends IRequestMeta {
  data: {
    link: string;
  };
}

async function fetchAffiliateLink(): Promise<string> {
  try {
    const url = `${config.AFFILIATE_API_URL}/links`;
    const response: IResponseData = await client.post(url);
    return response.data.link ?? '';
  } catch (error: any) {
    return '';
  }
}

const useAffiliateLink = () => {
  const cacheKey = [QueryKeys.affiliateLink];
  return useQuery(cacheKey, () => fetchAffiliateLink());
};

export {useAffiliateLink};
