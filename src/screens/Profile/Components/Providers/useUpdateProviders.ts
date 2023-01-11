/**
 * @format
 */
import {useMutation} from 'react-query';

import client from 'api';

import {showSnackbar} from '../../../../utils/SnackBar';
import {config} from '../../../../config';
import {IProfileResponse, useUserActions} from '../../../../redux/user';

export type RequestType = {providerIds: string[]};

export const useUpdateProvider = () => {
  const {setUserInfo} = useUserActions();

  async function updateProvider(request: RequestType) {
    try {
      const url = `${config.NEWS_API_URL}/users/providers`;
      const userInfo: IProfileResponse = await client.put(url, request);
      return Promise.resolve(userInfo.data);
    } catch (error: any) {
      return Promise.reject(error);
    }
  }

  const updateProviderMutation = useMutation(updateProvider, {
    onSuccess: data => {
      setUserInfo({user: data});
      const message = 'Providers updated successfully';
      showSnackbar({message, type: 'success'});
    },
    onError: (error: any) => {
      const message = error.message ?? 'Something went wrong';
      showSnackbar({message, type: 'error'});
    },
  });

  const tryUpdateProviders = (data: RequestType) =>
    updateProviderMutation.mutate(data);

  return {...updateProviderMutation, tryUpdateProviders};
};
