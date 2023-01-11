/**
 * @format
 */
import './wdyr';
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
// import App from './App';
import App from './src/App';
import {name as appName} from './app.json';

if (__DEV__) {
  // eslint-disable-next-line no-console
  import('./ReactotronConfig').then(() => console.log('Reactotron Configured'));
}

AppRegistry.registerComponent(appName, () => App);
