/**
 * @format
 */
import React from 'react';
import {useWindowDimensions} from 'react-native';
import {TabView, SceneMap} from 'react-native-tab-view';

import {HeaderLeft, HeaderTitle, SafeAreaContainer} from 'components';
import {RootStackScreenProps} from 'navigation/DrawerNav';

import CustomTopTabBar from './CustomTopTabBar';
import {Business} from './Business';
import {Podcasts} from './Podcasts';
import {NewsProviders} from './NewsProviders';

export const MIN_SEARCH_CHARACTERS = 3;

const TABS = [
  {key: 'business', title: 'BUSINESS NETWORK'},
  {key: 'podcasts', title: 'PODCASTS'},
  {key: 'news', title: 'NEWS'},
];

function Preferences(props: RootStackScreenProps<'Preference'>) {
  const {navigation} = props;
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);

  React.useLayoutEffect(() => {
    const headerLeft = () => <HeaderLeft onPress={navigation.goBack} />;
    const headerTitle = () => <HeaderTitle title="PREFERENCES" />;

    navigation.setOptions({
      headerShown: true,
      headerBackVisible: false,
      headerTitleAlign: 'center',
      headerTitle,
      headerLeft,
      headerRight: () => null,
    });
  }, [navigation]);

  return (
    <SafeAreaContainer>
      <TabView
        initialLayout={{width: layout.width}}
        navigationState={{index, routes: TABS}}
        renderScene={SceneMap({
          business: Business,
          podcasts: Podcasts,
          news: NewsProviders,
        })}
        renderTabBar={props1 => <CustomTopTabBar {...props1} />}
        onIndexChange={setIndex}
      />
    </SafeAreaContainer>
  );
}

export default Preferences;
