/**
 * @format
 */
import * as React from 'react';
import {StatusBar, Text, TextInput} from 'react-native';
import {NativeBaseProvider} from 'native-base';
import * as Sentry from '@sentry/react-native';
import RNBootSplash from 'react-native-bootsplash';

import {theme as defaultTheme, useAppTheme} from 'theme';
import {ConfirmModalProvider, ImageGallery} from 'components';
import FirstLoginPopup from 'components/FirstLoginPopup';
import {isAndroid} from './constants';

import NavContainer from './navigation';
import AppProviders from './AppProvider';

Sentry.init({
  dsn: 'https://6c6fcb6c96a54b1f9d88bc27d2d9ea9d@o4503902093180928.ingest.sentry.io/4503902096195584',
  environment: __DEV__ ? 'dev' : 'release',
});

function SubApp() {
  const theme = useAppTheme();

  return (
    <NativeBaseProvider theme={theme}>
      <ConfirmModalProvider>
        <NavContainer />
        <ImageGallery />
        <FirstLoginPopup />
      </ConfirmModalProvider>
    </NativeBaseProvider>
  );
}

interface TextWithDefaultProps extends Text {
  defaultProps?: {allowFontScaling?: boolean};
}
interface TextInputWithDefaultProps extends TextInput {
  defaultProps?: {allowFontScaling?: boolean};
}

function App() {
  const disableScaling = () => {
    (Text as unknown as TextWithDefaultProps).defaultProps =
      (Text as unknown as TextWithDefaultProps).defaultProps || {};
    (Text as unknown as TextWithDefaultProps).defaultProps!.allowFontScaling =
      false;
    (TextInput as unknown as TextInputWithDefaultProps).defaultProps =
      (TextInput as unknown as TextInputWithDefaultProps).defaultProps || {};
    (
      TextInput as unknown as TextInputWithDefaultProps
    ).defaultProps!.allowFontScaling = false;
  };

  React.useEffect(() => {
    disableScaling();
    RNBootSplash.hide({fade: true});
  }, []);

  return (
    <AppProviders>
      <StatusBar
        backgroundColor={defaultTheme.colors.brand['600']}
        barStyle={isAndroid ? 'light-content' : 'dark-content'}
      />
      <SubApp />
    </AppProviders>
  );
}

export default Sentry.wrap(App);
