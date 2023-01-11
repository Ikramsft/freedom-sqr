/**
 * @format
 */
import React from 'react';
import {LayoutChangeEvent} from 'react-native';
import {Divider, Text, View} from 'native-base';

import {useAppTheme} from 'theme';
import {SafeTouchable, Title} from 'components';

import {PodcastCommentItem} from './PodcastCommentItem';
import {
  AddComment,
  IAddCommentHandler,
} from '../../ArticleDetails/Comments/AddComment';
import {usePodcastComments} from './usePodcastComments';
import {useAddPodcastComment} from './useAddPodcastComment';

interface Props {
  episodeID: string;
  onLayout?: (event: number) => void;
}

export function PodcastComments(props: Props) {
  const {episodeID, onLayout} = props;

  const theme = useAppTheme();

  const addCommentRef = React.useRef<IAddCommentHandler>(null);

  const {tryAddComment, isLoading: isAdding} = useAddPodcastComment();

  const {list = [], hasNextPage, fetchNextPage} = usePodcastComments(episodeID);

  const onCommentsLayout = (event: LayoutChangeEvent) => {
    onLayout?.(event.nativeEvent.layout.y);
  };

  const onCommentNowPress = (comment: string) =>
    tryAddComment({
      comment,
      episodeID,
      callback: addCommentRef.current?.resetComment,
    });

  const loadNextPage = () => fetchNextPage();

  return (
    <View my={4} px={5} onLayout={onCommentsLayout}>
      <Title fontSize="lg" my={2}>{` ${
        list && list.length > 0 ? `Responses(${list.length})` : 'Responses(0)'
      }`}</Title>
      <AddComment
        isLoading={isAdding}
        ref={addCommentRef}
        onAddComment={onCommentNowPress}
      />
      {list.length > 0 ? (
        <View>
          <Text bold fontSize={18} mt={4}>
            MOST RELEVANT
          </Text>
        </View>
      ) : null}
      <Divider backgroundColor={theme.colors.gray[300]} mt={3} />
      {list.map((d, i) => {
        const key = `${d.commentID}-${i}`;
        return <PodcastCommentItem item={d} key={key} theme={theme} />;
      })}
      {hasNextPage && (
        <View my={4}>
          <SafeTouchable onPress={loadNextPage}>
            <Title>Load more comments</Title>
          </SafeTouchable>
        </View>
      )}
    </View>
  );
}

PodcastComments.defaultProps = {
  onLayout: undefined,
};
