/**
 * @format
 */
import React from 'react';
import {QueryClient, QueryClientProvider} from 'react-query';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {ThemeProvider} from 'theme';

import {persistor, store} from './redux/store';

const queryClient = new QueryClient();

interface ProvideProps {
  children: JSX.Element | JSX.Element[];
}

function AppProviders(props: ProvideProps) {
  const {children} = props;
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <SafeAreaProvider>{children}</SafeAreaProvider>
          </PersistGate>
        </Provider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default AppProviders;
