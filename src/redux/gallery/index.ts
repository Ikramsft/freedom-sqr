/**
 * @format
 */
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {useAppDispatch} from '../store';

export interface IGalleryImage {
  uri: string | undefined;
}

export interface IGalleryState {
  visible: boolean;
  imageData: IGalleryImage[];
}

const initialState: IGalleryState = {
  visible: false,
  imageData: [],
};

export const gallerySlice = createSlice({
  name: 'gallerySlice',
  initialState,
  reducers: {
    openGallery: (state, action: PayloadAction<IGalleryState>) => {
      state.visible = action.payload.visible;
      state.imageData = action.payload.imageData;
    },
    closeGallery: state => {
      state.visible = false;
      state.imageData = [];
    },
  },
});

export const {openGallery, closeGallery} = gallerySlice.actions;

export const useImageGallery = () => {
  const dispatch = useAppDispatch();

  const showGallery = (data: IGalleryImage[]) =>
    dispatch(openGallery({imageData: data, visible: true}));

  const hideGallery = () => dispatch(closeGallery());

  return {
    showGallery,
    hideGallery,
  };
};

export default gallerySlice.reducer;
