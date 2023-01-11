/**
 * @format
 */
import {useQuery} from 'react-query';

import client from 'api';

import {config} from '../../../config';
import {IRequestMeta} from '../../../constants';
import {QueryKeys} from '../../../utils/QueryKeys';

export interface ICategory {
  documentId: string;
  name: string;
}

export interface ICategoryListResponse extends IRequestMeta {
  data: ICategory[];
}

async function fetCategories(): Promise<ICategory[]> {
  try {
    const url = `${config.BUSINESS_API_URL}/categories`;
    const response: ICategoryListResponse = await client.get(url);
    return response.data;
  } catch (error) {
    return [];
  }
}

export const useBusinessCategories = () => {
  const cacheKey = [QueryKeys.categoryList];
  return useQuery(cacheKey, () => fetCategories());
};
