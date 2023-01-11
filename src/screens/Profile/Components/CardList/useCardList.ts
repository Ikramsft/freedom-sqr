/**
 * @format
 */
import {useQuery} from 'react-query';

import client from 'api';

import {config} from '../../../../config';
import {IRequestMeta} from '../../../../constants';
import {QueryKeys} from '../../../../utils/QueryKeys';
import {ICreditCard} from '../../../Payments/useCardForm';

export interface ICardListResponse extends IRequestMeta {
  data: ICreditCard[];
}

async function fetchCards(): Promise<ICreditCard[]> {
  try {
    const url = `${config.PAYMENT_API_URL}/creditCards`;
    const response: ICardListResponse = await client.get(url);
    return response.data;
  } catch (error) {
    return [];
  }
}

export const useCardList = () => {
  const cacheKey = [QueryKeys.cardList];
  return useQuery(cacheKey, () => fetchCards());
};
