/**
 * @format
 */
import {useMutation} from 'react-query';

import client from 'api';

import {showSnackbar} from '../../../../utils/SnackBar';
import {config} from '../../../../config';
import {IProfileResponse, useUserActions} from '../../../../redux/user';

export type RequestType = {stateIds: string[]};

export const useUpdateLocation = () => {
  const {setUserInfo} = useUserActions();

  async function updateStates(request: RequestType) {
    try {
      const url = `${config.USER_API}/users/states`;
      const userInfo: IProfileResponse = await client.put(url, request);
      return Promise.resolve(userInfo.data);
    } catch (error: any) {
      return Promise.reject(error);
    }
  }

  const updateStatesMutation = useMutation(updateStates, {
    onSuccess: data => {
      setUserInfo({user: data});
      const message = 'States updated successfully';
      showSnackbar({message, type: 'success'});
    },
    onError: (error: any) => {
      const message = error.message ?? 'Something went wrong';
      showSnackbar({message, type: 'error'});
    },
  });

  const tryUpdateStates = (data: RequestType) =>
    updateStatesMutation.mutate(data);

  return {...updateStatesMutation, tryUpdateStates};
};
