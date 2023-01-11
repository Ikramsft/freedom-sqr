/**
 * @format
 */
import React from 'react';
import {useQueryClient} from 'react-query';
import client from 'api';
import {config} from '../../../config/index';
import {showSnackbar} from '../../../utils/SnackBar';
import {IRequestMeta} from '../../../constants/types';
import {QueryKeys} from '../../../utils/QueryKeys';

export const useBusinessActions = () => {
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = React.useState(false);

  const tryFollowBusiness = async (
    businessID: string,
    callback?: (success: boolean) => void,
  ) => {
    setIsLoading(true);
    try {
      const url = `${config.BUSINESS_API_URL}/business/${businessID}/follow`;
      const response: IRequestMeta = await client.post(url, {});
      const msg = response.message || 'Follow Successfull!';
      showSnackbar({message: msg, type: 'success'});
      callback?.(true);
      const cacheKey = [QueryKeys.businessDetails, businessID];
      await queryClient.invalidateQueries(cacheKey);
      setIsLoading(false);
    } catch (err: any) {
      const msg = err.message || 'Something went wrong';
      showSnackbar({message: msg, type: 'error'});
      callback?.(false);
      setIsLoading(false);
    }
  };

  const tryUnfollowBusiness = async (
    businessID: string,
    callback?: (success: boolean) => void,
  ) => {
    setIsLoading(true);
    try {
      const url = `${config.BUSINESS_API_URL}/business/${businessID}/unfollow`;
      const response: IRequestMeta = await client.post(url, {});
      const msg = response.message || 'Unfollow Successfully!';
      showSnackbar({message: msg, type: 'success'});
      callback?.(true);
      const cacheKey = [QueryKeys.businessDetails, businessID];
      await queryClient.invalidateQueries(cacheKey);
      setIsLoading(false);
    } catch (err: any) {
      const msg = err.message || 'Something went wrong';
      showSnackbar({message: msg, type: 'error'});
      callback?.(false);
      setIsLoading(false);
    }
  };

  return {isLoading, tryFollowBusiness, tryUnfollowBusiness};
};
