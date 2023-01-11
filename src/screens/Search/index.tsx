/**
 * @format
 */
import React, {useState} from 'react';
import {ListRenderItem, RefreshControl, StyleSheet} from 'react-native';
import {FlatList, View, Text} from 'native-base';

import {
  Header,
  SafeAreaContainer,
  IProvider,
  TimelineItem,
  ContentLoader,
} from 'components';

import {IShortNews} from '../News/Queries/useNewsFeed';
import SearchBox from './SearchBox';
import {useSearch} from './Queries/useSearch';
import {
  BusinessPostInfo,
  BusinessPostItem,
} from '../BusinessDetail/BusinessPosts/BusinessPostItem';
import useDebounce from '../../hooks/useDebounce';
import {DrawerNavProps} from '../../navigation/DrawerNav';

type Props = DrawerNavProps<'Search'>;

function Search(props: Props) {
  const {navigation} = props;
  const [searchParams, setSearchParams] = useState('');

  const debounceSearch = useDebounce(searchParams, 500);

  const {isLoading, refetch, onEndReached, isFetchingNextPage, searchResult} =
    useSearch(debounceSearch);

  const onSelect = (type: string, id: string) => {
    if (type === 'news') {
      navigation.push('ArticleDetails', {id});
    } else if (type === 'podcasts') {
      navigation.push('PodcastDetail', {episodeID: id});
    }
  };

  const onSelectPost = async (info: BusinessPostInfo) => {
    navigation.push('BusinessSinglePost', {postId: info.contentID});
  };

  const onSelectProvider = async (info: BusinessPostInfo) => {
    navigation.push('BusinessDetail', {businessId: info.businessId});
  };

  const renderItem: ListRenderItem<IShortNews> = ({item, index}) => {
    const key = `search-item-${item?.postId}-${index}`;

    if (item.type === 'business') {
      return (
        <BusinessPostItem
          businessId={item.postProviderId}
          commentsCount={item.commentsCount}
          contentID={item.postId}
          imageURL={item.thumbnail}
          isLiked={item.isLiked}
          key={key}
          likesCount={item.likesCount}
          textContent={item.description}
          updatedAt={item.postedAt}
          userName={item.postProvider}
          onComments={onSelectPost}
          onLike={onSelectPost}
          onPostSelect={onSelectPost}
          onProviderSelect={onSelectProvider}
        />
      );
    }

    const provider: IProvider = {
      postProvider: item.postProvider,
      postProviderId: item.postProviderId,
      providerUrl: item.providerUrl,
      postProviderLogo: item.postProviderLogo,
    };

    return (
      <TimelineItem
        id={item.postId}
        image={item.thumbnail}
        key={key}
        name={item.postProvider}
        navigation={navigation}
        postedAt={item.postedAt}
        provider={provider}
        title={item.title}
        type={item.type}
        onSelect={onSelect}
      />
    );
  };

  const OnSearch = (text: string) => setSearchParams(text);

  const emptyContent = () => {
    if (!isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <Text fontSize={20}>No Searches</Text>
        </View>
      );
    }
    return <ContentLoader />;
  };

  return (
    <SafeAreaContainer edges={['top', 'bottom']}>
      <Header />
      <SearchBox onSearch={OnSearch} />
      <View flex={1}>
        <FlatList
          contentContainerStyle={styles.listContent}
          data={searchParams === '' ? [] : (searchResult as IShortNews[])}
          flex={1}
          keyExtractor={(item, index) =>
            `timeline-beyond-news-key-${index}-${item.postId}`
          }
          ListEmptyComponent={emptyContent}
          ListFooterComponent={
            isFetchingNextPage ? <ContentLoader count={1} /> : null
          }
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={refetch} />
          }
          renderItem={renderItem}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.8}
        />
      </View>
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  listContent: {
    flexGrow: 1,
    paddingBottom: 50,
  },
  emptyContainer: {
    minHeight: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Search;
