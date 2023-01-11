/**
 * @format
 */
import {useMutation} from 'react-query';
import client from 'api';
import {IFirstLogin} from '../../../components/FirstLoginPopup/useFirstLoginForm';
import {useUserInfo} from '../../../hooks/useUserInfo';
import {showSnackbar} from '../../../utils/SnackBar';
import {config} from '../../../config';
import {IProfileResponse, useUserActions} from '../../../redux/user';
import {IProfileForm} from './useProfileForm';
import {omitFields} from '../../../utils';

type RequestType = {
  values: IProfileForm | IFirstLogin;
  callback?: (success: boolean) => void;
};

export const useUpdateProfile = () => {
  const {setUserInfo} = useUserActions();
  const {user} = useUserInfo();

  async function updateProfile(data: RequestType) {
    try {
      const values = omitFields(data.values, ['validEmail', 'validUsername']);
      const url = `${config.USER_API}/users`;
      const userInfo: IProfileResponse = await client.patch(url, values);
      return Promise.resolve(userInfo.data);
    } catch (error: any) {
      return Promise.reject(error);
    }
  }

  const updateProfileMutation = useMutation(updateProfile, {
    onSuccess: (data, variables) => {
      const {callback} = variables;
      const newData = {...user, userName: data.userName};
      setUserInfo({user: newData});
      const message = 'Details updated successfully';
      showSnackbar({message, type: 'success'});
      callback?.(true);
    },
    onError: (error: any, variables) => {
      const {callback} = variables;
      const message = error.message ?? 'Something went wrong';
      showSnackbar({message, type: 'error'});
      callback?.(false);
    },
  });

  const tryUpdateProfile = (data: RequestType) =>
    updateProfileMutation.mutate(data);

  return {
    ...updateProfileMutation,
    tryUpdateProfile,
  };
};
