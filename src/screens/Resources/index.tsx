import React from 'react';
import {View, Text, FlatList} from 'native-base';
import {ListRenderItem, RefreshControl, StyleSheet} from 'react-native';

import {useAppTheme} from 'theme';
import {Header, SafeAreaContainer, ContentLoader} from 'components';

import {IResourceData} from '../News/Queries/useNewsFeed';
import ResourceItem from './ResourceItem';
import {useResourceList} from './Queries/useResourceFeed';

function Resources() {
  const {colors} = useAppTheme();

  const {resourceList, isLoading, refetch, isFetchingNextPage} =
    useResourceList();
  const renderItem: ListRenderItem<IResourceData> = ({item}) => {
    return <ResourceItem item={item} />;
  };

  const keyExtractor = React.useCallback(
    (item: IResourceData, index: number) =>
      `resource-page-key-${index}-${item.documentID}`,
    [],
  );

  return (
    <SafeAreaContainer edges={['top', 'bottom']}>
      <Header />
      <View flex={1}>
        <FlatList
          contentContainerStyle={styles.listContent}
          data={resourceList}
          flex={1}
          keyExtractor={keyExtractor}
          ListEmptyComponent={
            isLoading ? <ContentLoader type="Resource" /> : null
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <ContentLoader count={1} type="Resource" />
            ) : null
          }
          ListHeaderComponent={
            <View pt={2} px={4} width="full">
              <Text color={colors.black[800]} fontSize="2xl" fontWeight={700}>
                Resources
              </Text>
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={refetch} />
          }
          refreshing={isLoading}
          renderItem={renderItem}
          onEndReachedThreshold={0.8}
        />
      </View>
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  listContent: {
    flexGrow: 1,
  },
});

export default Resources;
