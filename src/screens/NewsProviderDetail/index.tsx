/**
 * @format
 */
import React from 'react';
import {StyleSheet} from 'react-native';
import {Spinner, View} from 'native-base';
import {
  TabBarProps,
  Tabs,
  MaterialTabBar,
} from 'react-native-collapsible-tab-view';
import {TabName} from 'react-native-collapsible-tab-view/lib/typescript/types';

import {RootStackScreenProps} from 'navigation/DrawerNav';
import {useAppTheme} from 'theme';
import {HeaderLeft, HeaderTitle, SafeAreaContainer} from 'components';

import {NewsProviderPosts} from './NewsProviderPosts';
import {NewsProviderHeader} from './NewsProviderHeader';
import {useArticleFollowActions} from '../ArticleDetails/Queries/useArticleFollowActions';
import {useUserInfo} from '../../hooks/useUserInfo';
import {useNewsProviderWallDetails} from './NewsProviderHeader/useNewsProviderDetails';
import {openInAppBrowser} from '../../utils';

function NewsProviderWall(props: RootStackScreenProps<'NewsProviderWall'>) {
  const {navigation, route} = props;

  const theme = useAppTheme();

  const {authenticated: isLoggedIn} = useUserInfo();

  const ref = React.useRef();

  const {provider} = route.params;

  React.useLayoutEffect(() => {
    const headerLeft = () => <HeaderLeft onPress={navigation.goBack} />;
    const headerTitle = () => <HeaderTitle title={provider.postProvider} />;
    navigation.setOptions({
      headerShown: true,
      headerBackVisible: false,
      headerTitleAlign: 'center',
      headerTitle,
      headerLeft,
      headerRight: () => null,
    });
  }, [navigation, provider]);

  const {tryFollowProvider, tryUnfollowProvider} = useArticleFollowActions();

  const {data: providerData, isLoading} = useNewsProviderWallDetails(
    provider?.postProviderId,
  );

  const [isFollowing, setIsFollowing] = React.useState(false);
  const [isFollowLoading, setIsFollowLoading] = React.useState(false);

  const onLoadFollowing = (following: boolean) => setIsFollowing(following);

  const onSuccess = React.useCallback(
    (success: boolean) => {
      if (success) {
        setIsFollowing(!isFollowing);
      }
      setIsFollowLoading(false);
    },
    [isFollowing],
  );

  const follow = () => {
    if (isLoggedIn) {
      setIsFollowLoading(true);
      tryFollowProvider(provider?.postProviderId, onSuccess);
    } else {
      navigation.navigate('Login');
    }
  };

  const unfollow = () => {
    if (isLoggedIn) {
      setIsFollowLoading(true);
      tryUnfollowProvider(provider?.postProviderId, onSuccess);
    } else {
      navigation.navigate('Login');
    }
  };

  const toggleFollow = () => {
    if (isFollowing) {
      unfollow();
    } else {
      follow();
    }
  };

  const onVisitWebsite = () => openInAppBrowser(providerData?.url || '');

  if (isLoading) {
    return (
      <SafeAreaContainer>
        <View alignItems="center" flexGrow={1} justifyContent="center">
          <Spinner />
        </View>
      </SafeAreaContainer>
    );
  }

  const renderHeader = () => {
    return (
      <NewsProviderHeader
        isFollowing={isFollowing}
        isLoading={isFollowLoading}
        provider={provider}
        theme={theme}
        toggleFollow={toggleFollow}
        onVisitWebsite={onVisitWebsite}
      />
    );
  };

  const renderTabBar = (params: TabBarProps<TabName>) => {
    return (
      <MaterialTabBar
        {...params}
        scrollEnabled
        activeColor={theme.colors.black[900]}
        contentContainerStyle={styles.tabContainerStyle}
        getLabelText={(name: TabName) => name.toString()}
        inactiveColor={theme.colors.black[300]}
        indicatorStyle={{backgroundColor: theme.colors.maroon[900]}}
        labelStyle={styles.tabBarLabel}
      />
    );
  };

  const onSelect = (id: string) => navigation.push('ArticleDetails', {id});

  return (
    <SafeAreaContainer>
      <Tabs.Container
        headerContainerStyle={[styles.headerContainerStyle]}
        headerHeight={400}
        pagerProps={{keyboardShouldPersistTaps: 'always'}}
        ref={ref}
        renderHeader={renderHeader}
        renderTabBar={renderTabBar}>
        <Tabs.Tab name="ARTICLES">
          <NewsProviderPosts
            provider={provider}
            theme={theme}
            onLoadFollowing={onLoadFollowing}
            onSelect={onSelect}
          />
        </Tabs.Tab>
      </Tabs.Container>
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  tabBarLabel: {
    width: '100%',
    alignSelf: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  tabContainerStyle: {
    alignItems: 'center',
  },
  headerContainerStyle: {
    shadowOpacity: 0,
    elevation: 0,
    borderBottomWidth: 1,
  },
});

export default NewsProviderWall;
