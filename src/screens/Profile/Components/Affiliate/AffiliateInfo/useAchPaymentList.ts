/**
 * @format
 */
import {useQuery} from 'react-query';

import client from 'api';

import {config} from '../../../../../config';
import {QueryKeys} from '../../../../../utils/QueryKeys';
import {IRequestMeta} from '../../../../../constants/types';
import {IAchDetails} from '../ManageAchInfo/useAchForm';

export interface IResponseData extends IRequestMeta {
  data: IAchDetails[];
}

async function fetchAchInfo(): Promise<IAchDetails[]> {
  try {
    const url = `${config.PAYMENT_API_URL}/ach`;
    const response: IResponseData = await client.get(url);
    return response.data;
  } catch (error: any) {
    return [];
  }
}

const useAchPaymentList = () => {
  return useQuery(QueryKeys.achPaymentList, () => fetchAchInfo());
};

export {useAchPaymentList};
