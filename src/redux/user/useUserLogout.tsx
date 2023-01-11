/**
 * @format
 */
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {useNavigation} from '@react-navigation/native';
import {Text} from 'native-base';
import {useQueryClient} from 'react-query';

import {SubTitle, useConfirmModal} from 'components';

import {useUserActions} from '.';
import {DrawerParamList} from '../../navigation/DrawerNav';
import {QueryKeys} from '../../utils/QueryKeys';
import {persistor} from '../store';

export const useUserLogout = () => {
  const {logoutUser} = useUserActions();
  const queryClient = useQueryClient();

  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();

  const confirm = useConfirmModal();

  const resetQuery = async () => {
    await queryClient.invalidateQueries([QueryKeys.featuredBusiness]);
    await queryClient.invalidateQueries([QueryKeys.recentBusiness]);
    await queryClient.invalidateQueries([QueryKeys.allBusiness]);
    await persistor.purge();
    await queryClient.clear();
  };

  const onConfirmLogout = async () => {
    logoutUser();
    navigation.navigate('Home');
    await resetQuery();
  };

  const tryLogoutUser = async () => {
    confirm?.show?.({
      title: <SubTitle fontSize={18}>Logout</SubTitle>,
      message: (
        <Text>
          <Text>Are you sure you want to logout?</Text>
        </Text>
      ),
      onConfirm: onConfirmLogout,
      submitLabel: 'YES',
      cancelLabel: 'CANCEL',
    });
  };

  return {
    tryLogoutUser,
    onConfirmLogout,
  };
};
