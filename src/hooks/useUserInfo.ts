/**
 * @format
 */
import {useSelector} from 'react-redux';

import {RootState} from '../redux/store';
import {IUserState} from '../redux/user/userInterface';

function useUserInfo(): IUserState {
  const userInfo: IUserState = useSelector((state: RootState) => state.user);
  return userInfo;
}

export {useUserInfo};
