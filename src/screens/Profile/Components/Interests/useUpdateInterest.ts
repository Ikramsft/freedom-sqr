/**
 * @format
 */
import {useMutation} from 'react-query';

import client from 'api';

import {showSnackbar} from '../../../../utils/SnackBar';
import {config} from '../../../../config';
import {IProfileResponse, useUserActions} from '../../../../redux/user';

export type RequestType = {interestIds: string[]};

export const useUpdateInterest = () => {
  const {setUserInfo} = useUserActions();

  async function updateInterest(request: RequestType) {
    try {
      const url = `${config.USER_API}/users/interests`;
      const userInfo: IProfileResponse = await client.put(url, request);
      return Promise.resolve(userInfo.data);
    } catch (error: any) {
      return Promise.reject(error);
    }
  }

  const updateInterestMutation = useMutation(updateInterest, {
    onSuccess: data => {
      setUserInfo({user: data});
      const message = 'Interests updated successfully';
      showSnackbar({message, type: 'success'});
    },
    onError: (error: any) => {
      const message = error.message ?? 'Something went wrong';
      showSnackbar({message, type: 'error'});
    },
  });

  const tryUpdateInterests = (data: RequestType) =>
    updateInterestMutation.mutate(data);

  return {...updateInterestMutation, tryUpdateInterests};
};
