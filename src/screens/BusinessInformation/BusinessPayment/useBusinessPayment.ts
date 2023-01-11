/**
 * @format
 */
import React from 'react';
import {useQueryClient} from 'react-query';
import client from 'api';
import {IRequestMeta} from '../../../constants';
import {config} from '../../../config/index';
import {showSnackbar} from '../../../utils/SnackBar';
import {IBusinessPaymentInfo} from './useBusinessPaymentForm';
import {QueryKeys} from '../../../utils/QueryKeys';

export interface IBusinessPaymentResponse extends IRequestMeta {
  data: {
    status: string;
    documentId: string;
  };
}

export interface IPaymentRequest
  extends Omit<
    IBusinessPaymentInfo,
    'sameAsBusiness' | 'expireMonth' | 'expireYear'
  > {
  businessId: string;
  expirationDate: string;
  alias: string;
}

export interface IExistingCardRequest {
  businessId: string;
  cardId: string;
  amount: number;
}

export const useBusinessPayment = () => {
  const queryClient = useQueryClient();

  const [isLoading, setLoading] = React.useState(false);

  const tryCreatePayment = async (
    values: IPaymentRequest,
    callback?: (success: boolean) => void,
  ) => {
    const {businessId, ...rest} = values;
    try {
      setLoading(true);
      const url = `${config.BUSINESS_API_URL}/business/${businessId}/payments`;
      await client.post(url, rest);
      callback?.(true);
      setLoading(false);
      queryClient.invalidateQueries(QueryKeys.businessInfo);
    } catch (err: any) {
      const msg = err.message || 'Something went wrong';
      showSnackbar({message: msg, type: 'error'});
      callback?.(false);
      setLoading(false);
    }
  };

  const tryExistingCardForPayment = async (
    values: IExistingCardRequest,
    callback?: (success: boolean) => void,
  ) => {
    const {businessId, ...rest} = values;
    try {
      setLoading(true);
      const url = `${config.BUSINESS_API_URL}/business/${businessId}/cardPayments`;
      await client.post(url, rest);
      callback?.(true);
      setLoading(false);
      queryClient.invalidateQueries(QueryKeys.businessInfo);
    } catch (err: any) {
      const msg = err.message || 'Something went wrong';
      console.log('msg', msg);
      showSnackbar({message: msg, type: 'error'});
      callback?.(false);
      setLoading(false);
    }
  };

  return {isLoading, tryCreatePayment, tryExistingCardForPayment};
};
