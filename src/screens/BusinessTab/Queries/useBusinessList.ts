/**
 * @format
 */
import {useQuery} from 'react-query';
import client from 'api';
import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';
import {IRequestMeta} from '../../../constants/types';
import {RECORD_PER_PAGE} from '../../../constants/common';
import {IBusinessItem} from './useBusinessTab';

export type BusinessTabType = 'isFeatured' | 'recent' | 'all';

export interface IImages {
  croppedImageDetails: string;
  croppedImageReadUrl: string;
  documentId: string;
  imageType: string;
  originalImageReadUrl: string;
}
export interface IResponseData extends IRequestMeta {
  data: IBusinessItem[];
  error: boolean;
  message: string;
  status: number;
}
const PAGE_NUMBER = 1;

async function fetchBusiness(type: BusinessTabType): Promise<IBusinessItem[]> {
  try {
    let url = `${config.BUSINESS_TAB_URL}/businesses?limit=${RECORD_PER_PAGE}&offset=${PAGE_NUMBER}&`;
    switch (type) {
      case 'all':
        url += `&isFeatured=false&type=all`;
        break;
      case 'recent':
        url += `&isFeatured=false&type=recent`;
        break;
      case 'isFeatured':
        url += `&isFeatured=true&type=all`;
        break;
      default:
        break;
    }
    const response: IResponseData = await client.get(url);
    return response.data;
  } catch (error: any) {
    return [];
  }
}

const useFeaturedBusiness = () => {
  const cacheKey = [QueryKeys.featuredBusiness];
  return useQuery(cacheKey, () => fetchBusiness('isFeatured'));
};

const useRecentBusiness = () => {
  const cacheKey = [QueryKeys.recentBusiness];
  return useQuery(cacheKey, () => fetchBusiness('recent'));
};

const useAllBusiness = () => {
  const cacheKey = [QueryKeys.allBusiness];
  return useQuery(cacheKey, () => fetchBusiness('all'));
};

export {useFeaturedBusiness, useAllBusiness, useRecentBusiness};
