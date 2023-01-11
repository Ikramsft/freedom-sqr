/**
 * @format
 */
import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {PersistConfig, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {isNil} from 'lodash';

import client from 'api';

import {RootState, useAppDispatch} from '../store';
import {IUserState, IUser} from './userInterface';
import {IRequestMeta} from '../../constants';
import {config} from '../../config';
import {PicCroppedDetails} from '../../components/ImageCropper/interfaces';

export const initialUserAuthData: IUser = {
  documentId: '',
  email: '',
  fullName: '',
  interests: [],
  providers: [],
  isEmailVerified: false,
  states: [],
  userName: '',
  originalImageReadUrl: '',
  croppedImageReadUrl: '',
  imageViewAttribute: '',
  type: 'individual',
  croppedImageDetails: undefined,
  affiliateUserId: '',
  influencerStatus: false,
};

// Define the initial state using that type
const initialState: IUserState = {
  authenticated: false,
  loading: false,
  accessToken: null,
  refreshToken: null,
  errorMessage: null,
  user: {} as IUser,
};

type UserInfo = {
  authenticated?: boolean;
  accessToken?: string;
  refreshToken?: string;
  user: IUser;
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthenticated: state => {
      state.authenticated = true;
    },
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      if (!isNil(action.payload.authenticated)) {
        state.authenticated = action.payload.authenticated;
      }
      state.user = action.payload.user;
      if (state.user?.imageViewAttribute) {
        try {
          const imageViewAttribute: PicCroppedDetails = JSON.parse(
            state.user?.imageViewAttribute,
          );
          state.user.croppedImageDetails = imageViewAttribute;
          // eslint-disable-next-line no-empty
        } catch (error) {}
      }
      if (action.payload.accessToken) {
        state.accessToken = action.payload.accessToken;
      }
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    updateProfilePic: (state, {payload}) => {
      state.user = {...state.user, ...payload};
    },
    logoutUser: state => {
      state.authenticated = initialState.authenticated;
      state.loading = initialState.loading;
      state.accessToken = initialState.accessToken;
      state.refreshToken = initialState.refreshToken;
      state.errorMessage = initialState.errorMessage;
      state.user = initialState.user;
    },
  },
});

export const {
  setAuthenticated,
  setAccessToken,
  setUserInfo,
  logoutUser,
  updateProfilePic,
} = userSlice.actions;

export const useUserActions = () => {
  const dispatch = useAppDispatch();

  return {
    updateProfilePic: (data: {
      croppedImageReadUrl: string;
      originalImageReadUrl: string;
      croppedImageDetails: PicCroppedDetails;
    }) => dispatch(updateProfilePic(data)),
    setAuthenticated: () => dispatch(setAuthenticated()),
    setUserInfo: (data: UserInfo) => dispatch(setUserInfo(data)),
    logoutUser: () => dispatch(logoutUser()),
  };
};

const persistConfig: PersistConfig<IUserState> = {
  key: 'user',
  version: 1,
  storage: AsyncStorage,
  blacklist: ['userAuthData'],
};

export interface IProfileResponse extends IRequestMeta {
  data: IUser;
}

export const getUserProfile = createAsyncThunk(
  'users/profile',
  async (_info, thunkApi) => {
    const state = thunkApi.getState();
    const currentUser = (state as RootState)?.user;
    if (currentUser.authenticated && currentUser.accessToken) {
      const url = `${config.USER_API}/users/${currentUser.user.documentId}`;
      const response: IProfileResponse = await client.get(url);
      thunkApi.dispatch(setUserInfo({user: response.data}));
    }
  },
);

export interface IRefreshResponse {
  data: {
    accessToken: string;
  };
}

export const refreshToken = async (rToken: string) => {
  try {
    const url = `${config.USER_API}/users/refreshToken`;
    const data = {refreshToken: rToken};
    const response: IRefreshResponse = await client.post(url, data);
    return Promise.resolve(response.data);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export default persistReducer(persistConfig, userSlice.reducer);
