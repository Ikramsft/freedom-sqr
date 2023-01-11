/**
 * @format
 */
import {
  initThemeProvider,
  useStyle,
} from '@pavelgric/react-native-theme-provider';

import {theme} from './theme';

export const themes = {dark: theme};

export type Themes = typeof themes;
export const {
  createUseStyle,
  createStyle,
  useTheme,
  useThemeDispatch,
  ThemeProvider,
} = initThemeProvider({themes, initialTheme: 'dark'});

const useAppTheme = () => {
  const {selectedTheme} = useTheme();
  const appTheme = themes[selectedTheme];
  return appTheme;
};

const useSetAppTheme = () => {
  const {setTheme} = useThemeDispatch();
  return {setTheme};
};

export {useStyle, useAppTheme, useSetAppTheme};
