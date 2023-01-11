/**
 * @format
 */
import {extendTheme} from 'native-base';

const newColorTheme = {
  brand: {
    950: '#02284D',
    900: '#8287af',
    850: '#004281',
    800: '#7c83db',
    700: '#b3bef6',
    600: '#28356A',
  },
  white: {
    900: '#fff',
    800: '#f4f4f4',
    700: '#FBFBFB',
  },
  black: {
    900: '#000',
    800: '#11142D',
    700: '#1D1D1D',
    500: '#00000050',
    400: '#2D2D2D',
  },
  red: {
    900: '#FF0000',
    800: '#EC1C24',
  },
  gray: {
    800: '#595959',
    700: '#D9D9D9',
    600: '#515151',
    550: '#9A9AB0',
    500: '#AEAEAE',
    400: 'rgba(137, 137, 137, 0.4)',
    300: '#CCCCCC',
    200: 'rgba(0, 0, 0, 0.12)',
  },
  maroon: {
    900: '#B32A48',
  },
  transparent: 'rgba(255,255,255,0)',
};

export const fontFamily = {
  black: 'Inter-Black',
  bold: 'Inter-Bold',
  extraBold: 'Inter-ExtraBold',
  extraLight: 'Inter-ExtraLight',
  light: 'Inter-Light',
  medium: 'Inter-Medium',
  regular: 'Inter-Regular',
  semiBold: 'Inter-SemiBold',
  thin: 'Inter-Thin',
};

export const theme = extendTheme({
  colors: newColorTheme,
  fontConfig: {
    Inter: {
      100: {
        normal: 'Inter-Regular',
      },
      200: {
        normal: 'Inter-Regular',
      },
      300: {
        normal: 'Inter-Regular',
      },
      400: {
        normal: 'Inter-Regular',
      },
      500: {
        normal: 'Inter-Medium',
      },
      600: {
        normal: 'Inter-Medium',
      },
      700: {
        normal: 'Inter-Bold',
      },
      800: {
        normal: 'Inter-Bold',
      },
      900: {
        normal: 'Inter-Bold',
      },
    },
  },
  // Make sure values below matches any of the keys in `fontConfig`
  fonts: {
    heading: fontFamily.regular,
    body: fontFamily.regular,
    mono: fontFamily.regular,
  },
});

export type AppTheme = typeof theme;
