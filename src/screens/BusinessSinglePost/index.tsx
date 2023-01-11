/**
 * @format
 */
import React from 'react';
import {
  FlatList,
  LayoutChangeEvent,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import {View, Text, Divider, Spinner} from 'native-base';

import {RootStackScreenProps} from 'navigation/DrawerNav';
import {useAppTheme} from 'theme';
import {
  HeaderLeft,
  HeaderTitle,
  SafeAreaContainer,
  Error,
} from 'components';

import {useBusinessSinglePost} from './useBusinessSinglePost';
import {ISingleComment, useSingleComments} from './useSingleComments';
import {
  AddComment,
  IAddCommentHandler,
} from '../ArticleDetails/Comments/AddComment';
import {useAddSingleComment} from './useAddSingleComments';
import SinglePostItem from './SinglePostItem';
import SinglePostHeader from './SinglePostHeader';
import {useUserInfo} from '../../hooks/useUserInfo';

function BusinessSinglePost(props: RootStackScreenProps<'BusinessSinglePost'>) {
  const {navigation, route} = props;
  const {postId} = route.params;
  const scrollRef = React.useRef<FlatList | null>(null);

  const theme = useAppTheme();
  const {authenticated: isLoggedIn} = useUserInfo();

  const scrollPositions = React.useRef({commentsYPosition: 0}).current;

  const {data, isLoading, isError, refetch} = useBusinessSinglePost(postId);

  const {tryAddComment, isLoading: isAdding} = useAddSingleComment();

  const addCommentRef = React.useRef<IAddCommentHandler>(null);

  React.useLayoutEffect(() => {
    const headerLeft = () => <HeaderLeft onPress={navigation.goBack} />;
    const headerTitle = () => <HeaderTitle title="Business Post" />;

    navigation.setOptions({
      headerShown: true,
      headerBackVisible: false,
      headerTitleAlign: 'center',
      headerTitle,
      headerLeft,
      headerRight: () => null,
    });
  }, [navigation]);

  const {
    list = [],
    refetch: refetchComments,
    isFetchingNextPage,
    onEndReached,
  } = useSingleComments(postId, isLoggedIn);

  const onCommentNowPress = (comment: string) =>
    tryAddComment({
      comment,
      PostId: postId,
      callback: addCommentRef.current?.resetComment,
    });

  const renderItem: ListRenderItem<ISingleComment> = ({item}) => {
    return <SinglePostItem item={item} />;
  };

  const keyExtractor = React.useCallback(
    (item: ISingleComment, index: number) =>
      `key-all-business-${index}-${item.documentID}`,
    [],
  );

  if (isLoading) {
    return (
      <SafeAreaContainer>
        <Spinner />
      </SafeAreaContainer>
    );
  }

  if (isError || !data) {
    return (
      <SafeAreaContainer>
        <Error retry={refetch} />
      </SafeAreaContainer>
    );
  }

  const onLayout = (event: LayoutChangeEvent) => {
    scrollPositions.commentsYPosition = event.nativeEvent.layout.y;
  };

  const onComment = () => {
    if (isLoggedIn) {
      scrollRef?.current?.scrollToOffset({
        animated: true,
        offset: scrollPositions.commentsYPosition,
      });
    } else {
      navigation.navigate('Login');
    }
  };

  return (
    <SafeAreaContainer>
      <View>
        <FlatList
          contentContainerStyle={styles.contentView}
          data={list}
          keyExtractor={keyExtractor}
          ListFooterComponent={
            isFetchingNextPage ? <Spinner mb={20} mt={20} /> : null
          }
          ListHeaderComponent={
            <View>
              <SinglePostHeader
                navigation={navigation}
                postId={postId}
                onComment={onComment}
              />
              <AddComment
                isLoading={isAdding}
                ref={addCommentRef}
                onAddComment={onCommentNowPress}
                onLayout={onLayout}
              />
              {list.length > 0 ? (
                <View>
                  <Text bold fontSize={18} mt={4}>
                    Most Relevant
                  </Text>
                </View>
              ) : null}
            </View>
          }
          ref={scrollRef}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetchComments}
            />
          }
          refreshing={isLoading}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.8}
        />
        <Divider backgroundColor={theme.colors.gray[300]} mt={3} />
      </View>
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  contentView: {
    marginHorizontal: 16,
    paddingBottom: 50,
  },
});

export default BusinessSinglePost;
