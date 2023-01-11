/**
 * @format
 */
import React, {useCallback} from 'react';
import {Tabs} from 'react-native-collapsible-tab-view';
import {ListRenderItem, StyleSheet} from 'react-native';
import {Spinner, Text, View} from 'native-base';

import {RootStackNavigationProps} from 'navigation/DrawerNav';

import {
  BusinessPostInfo,
  BusinessPostItem,
  IBusinessPost,
} from './BusinessPostItem';
import {useBusinessPosts} from './useBusinessPosts';

interface Props {
  businessId: string;
  navigation: RootStackNavigationProps<'BusinessDetail'>;
}

function BusinessPosts(props: Props) {
  const {navigation, businessId} = props;

  const {list = [], isLoading, onEndReached} = useBusinessPosts(businessId);

  const onPostPress = (info: BusinessPostInfo) =>
    navigation.navigate('BusinessSinglePost', {postId: info.contentID});

  const renderItem: ListRenderItem<IBusinessPost> = ({item}) => (
    <BusinessPostItem
      businessId={businessId}
      commentsCount={item.commentsCount}
      contentID={item.documentId}
      imageURL={item.image?.imageURL}
      isLiked={item.isLiked}
      likesCount={item.likesCount}
      logoUrl={item.user.croppedImageReadUrl}
      textContent={item.textContent}
      updatedAt={item.updatedAt}
      userName={item.user.userName}
      onComments={onPostPress}
      onLike={onPostPress}
      onPostSelect={onPostPress}
      onShare={onPostPress}
    />
  );

  const keyExtractor = useCallback(
    (item: IBusinessPost, index: number) => `key-${index}-${item.contentID}`,
    [],
  );

  return (
    <Tabs.FlatList
      contentContainerStyle={styles.listStyle}
      data={list}
      keyboardShouldPersistTaps="handled"
      keyExtractor={keyExtractor}
      ListEmptyComponent={
        !isLoading ? (
          <View alignItems="center" mt={6}>
            <Text>No Posts Found</Text>
          </View>
        ) : null
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

export {BusinessPosts};
