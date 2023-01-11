/**
 * @format
 */
import * as React from 'react';
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
import {
  HeaderLeft,
  HeaderTitle,
  SafeAreaContainer,
  Error,
  FloatingButton,
} from 'components';

import {BusinessPosts} from './BusinessPosts';
import {BusinessMedia} from './BusinessMedia';
import {BusinessHeader} from './BusinessHeader';
import {useBusinessDetails} from './useBusinessDetails';

function BusinessDetail(props: RootStackScreenProps<'BusinessDetail'>) {
  const {navigation, route} = props;

  const theme = useAppTheme();

  const ref = React.useRef();

  const {businessId} = route.params;

  const {
    data: businessInfo,
    isLoading,
    error,
    refetch,
  } = useBusinessDetails(businessId);

  React.useLayoutEffect(() => {
    const headerLeft = () => <HeaderLeft onPress={navigation.goBack} />;
    const headerTitle = () => <HeaderTitle title={businessInfo?.name ?? ''} />;
    navigation.setOptions({
      headerShown: true,
      headerBackVisible: false,
      headerTitleAlign: 'center',
      headerTitle,
      headerLeft,
      headerRight: () => null,
    });
  }, [businessInfo, navigation]);

  const renderHeader = () => {
    if (businessInfo) {
      return <BusinessHeader info={businessInfo} theme={theme} />;
    }
    return null;
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

  const onAddPress = () => navigation.navigate('CreatePost', {businessId});

  if (isLoading) {
    return (
      <SafeAreaContainer>
        <Spinner />
      </SafeAreaContainer>
    );
  }

  if (error || !businessInfo) {
    return (
      <SafeAreaContainer>
        <Error retry={refetch} />
      </SafeAreaContainer>
    );
  }

  const {role} = businessInfo;

  const isOwner = role === 'owner';

  const Button = isOwner ? <FloatingButton onPress={onAddPress} /> : <View />;

  return (
    <SafeAreaContainer>
      <Tabs.Container
        headerContainerStyle={[styles.headerContainerStyle]}
        headerHeight={400}
        pagerProps={{keyboardShouldPersistTaps: 'always'}}
        ref={ref}
        renderHeader={renderHeader}
        renderTabBar={renderTabBar}>
        <Tabs.Tab name="POSTS">
          <BusinessPosts businessId={businessId} navigation={navigation} />
        </Tabs.Tab>
        <Tabs.Tab name="MEDIA">
          <BusinessMedia info={businessInfo} />
        </Tabs.Tab>
      </Tabs.Container>
      {Button}
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

export default BusinessDetail;
