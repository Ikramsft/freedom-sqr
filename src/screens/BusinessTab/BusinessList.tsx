/**
 * @format
 */
import React from 'react';
import {Text, View} from 'native-base';
import {
  FlatList,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
} from 'react-native';

import {RootStackScreenProps} from 'navigation/DrawerNav';
import {
  ContentLoader,
  HeaderLeft,
  HeaderTitle,
  SafeAreaContainer,
} from 'components';

import BusinessItem from './FeaturedBusiness/BusinessItem';
import {IBusinessItem, useBusinessTab} from './Queries/useBusinessTab';

function DetailsList(props: RootStackScreenProps<'BusinessList'>) {
  const {navigation, route} = props;
  const {heading, type} = route.params;

  React.useLayoutEffect(() => {
    const headerLeft = () => <HeaderLeft onPress={navigation.goBack} />;
    const headerTitle = () => <HeaderTitle title={heading} />;
    navigation.setOptions({
      headerShown: true,
      headerBackVisible: false,
      headerTitleAlign: 'center',
      headerTitle,
      headerLeft,
      headerRight: () => null,
    });
  }, [heading, navigation]);

  const {businessList, isLoading, refetch, isFetchingNextPage, onEndReached} =
    useBusinessTab(type);

  const onSelect = (item: IBusinessItem) =>
    navigation.navigate('BusinessDetail', {businessId: item.documentId});

  const renderItem: ListRenderItem<IBusinessItem> = ({item, index}) => {
    return <BusinessItem item={item} onSelect={onSelect} />;
  };

  const keyExtractor = React.useCallback(
    (item: IBusinessItem, index: number) =>
      `key-all-business-${index}-${item.documentId}`,
    [],
  );

  return (
    <SafeAreaContainer>
      <FlatList
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.contentView}
        data={businessList}
        keyExtractor={keyExtractor}
        ListEmptyComponent={
          isLoading ? (
            <ContentLoader count={2} type="Business" />
          ) : (
            <View mx={2}>
              <View pt={2}>
                <Text fontSize={16} fontWeight={600}>
                  No recent businesses available
                </Text>
              </View>
            </View>
          )
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <ContentLoader count={1} type="Business" />
          ) : null
        }
        numColumns={2}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refetch} />
        }
        refreshing={isLoading}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.8}
      />
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  contentView: {
    justifyContent: 'space-between',
    marginHorizontal: 16,
  },
  column: {
    width: '50%',
    marginVertical: 5,
  },
});

export default DetailsList;
