/**
 * @format
 */
import React, {useCallback} from 'react';
import {Tabs} from 'react-native-collapsible-tab-view';
import {ListRenderItem, StyleSheet} from 'react-native';
import {Spinner, Text, View} from 'native-base';

import {AppTheme} from 'theme';

import {NewsProviderPostItem, INewsProviderPost} from './NewsProviderPostItem';
import {useNewsProviderPosts} from './useNewsProviderPosts';
import {RECORD_PER_PAGE} from '../../../constants';
import {IProvider} from '../../../components/TimelineItem';

interface Props {
  provider: IProvider;
  theme: AppTheme;
  onLoadFollowing?: (following: boolean) => void;
  onSelect?: (id: string) => void;
}

function NewsProviderPosts(props: Props) {
  const {provider, theme, onLoadFollowing, onSelect} = props;

  const {postProviderId: providerId, postProvider} = provider;

  const {
    newsList = [],
    isLoading,
    onEndReached,
    isFetchingNextPage,
  } = useNewsProviderPosts(providerId);

  React.useEffect(() => {
    if (newsList.length > 0 && newsList.length < RECORD_PER_PAGE) {
      onLoadFollowing?.(newsList[0].provider.isFollowed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newsList]);

  const renderItem: ListRenderItem<INewsProviderPost> = ({item}) => {
    return (
      <NewsProviderPostItem
        item={item}
        postProvider={postProvider}
        theme={theme}
        onSelect={onSelect}
      />
    );
  };

  const keyExtractor = useCallback(
    (item: INewsProviderPost, index: number) =>
      `key-${index}-${item.providerID}`,
    [],
  );

  return (
    <Tabs.FlatList
      contentContainerStyle={styles.listStyle}
      data={newsList}
      keyboardShouldPersistTaps="handled"
      keyExtractor={keyExtractor}
      ListEmptyComponent={
        !isLoading ? (
          <View alignItems="center" mt={6}>
            <Text>No Posts Found</Text>
          </View>
        ) : null
      }
      ListFooterComponent={
        isFetchingNextPage ? <Spinner mb={20} mt={10} /> : null
      }
      ListHeaderComponent={isLoading ? <Spinner mt={6} /> : null}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
    />
  );
}

const styles = StyleSheet.create({listStyle: {paddingBottom: 50}});

NewsProviderPosts.defaultProps = {
  onLoadFollowing: undefined,
  onSelect: undefined,
};

export {NewsProviderPosts};
