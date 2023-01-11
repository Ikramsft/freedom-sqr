/**
 * @format
 */
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IAdsItem} from '../../hooks/useAds';
import {useAppDispatch} from '../store';

export interface IAdvertisementState {
  currentSequence: number;
  homeViewAllAdv: IAdsItem[];
  newsAdvertisements: IAdsItem[];
  podCastAdvertisements: IAdsItem[];
  businessAdvertisements: IAdsItem[];
}

const initialState: IAdvertisementState = {
  currentSequence: 0,
  homeViewAllAdv: [],
  newsAdvertisements: [],
  podCastAdvertisements: [],
  businessAdvertisements: [],
};

export const advertisementSlice = createSlice({
  name: 'advertisementSlice',
  initialState,
  reducers: {
    setCurrentSequence: (state, action: PayloadAction<number>) => {
      state.currentSequence = action.payload;
    },
    setHomeViewAllAdv: (state, action: PayloadAction<IAdsItem>) => {
      state.homeViewAllAdv = [...state.homeViewAllAdv, action.payload];
    },
    setNewsAdv: (state, action: PayloadAction<IAdsItem>) => {
      state.newsAdvertisements = [...state.newsAdvertisements, action.payload];
    },
    setBusinessAdv: (state, action: PayloadAction<IAdsItem>) => {
      state.businessAdvertisements = [
        ...state.businessAdvertisements,
        action.payload,
      ];
    },
    setPodCastAdv: (state, action: PayloadAction<IAdsItem>) => {
      state.podCastAdvertisements = [
        ...state.podCastAdvertisements,
        action.payload,
      ];
    },
  },
});

export const {
  setCurrentSequence,
  setHomeViewAllAdv,
  setNewsAdv,
  setPodCastAdv,
  setBusinessAdv,
} = advertisementSlice.actions;

export const useAdvertisement = () => {
  const dispatch = useAppDispatch();
  const pushCurrentSequence = (data: number) =>
    dispatch(setCurrentSequence(data));
  const pushHomeViewAllAdv = (data: IAdsItem) =>
    dispatch(setHomeViewAllAdv(data));
  const pushNewsAdv = (data: IAdsItem) => dispatch(setNewsAdv(data));
  const pushPodCastAdv = (data: IAdsItem) => dispatch(setPodCastAdv(data));
  const pushBusinessAdv = (data: IAdsItem) => dispatch(setBusinessAdv(data));
  return {
    pushCurrentSequence,
    pushHomeViewAllAdv,
    pushNewsAdv,
    pushPodCastAdv,
    pushBusinessAdv,
  };
};

export default advertisementSlice.reducer;
