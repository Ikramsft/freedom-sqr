/**
 * @format
 */
import React from 'react';
import {LayoutChangeEvent} from 'react-native';
import {View} from 'native-base';

import {useAppTheme} from 'theme';
import {SafeTouchable, Title} from 'components';

import {CommentItem} from './CommentItem';
import {AddComment, IAddCommentHandler} from './AddComment';
import {useComments} from './useComments';
import {useAddComment} from './useAddComment';

interface Props {
  articleId: string;
  onLayout?: (event: number) => void;
}

export function Comments(props: Props) {
  const {articleId, onLayout} = props;

  const theme = useAppTheme();

  const addCommentRef = React.useRef<IAddCommentHandler>(null);

  const {tryAddComment, isLoading: isAdding} = useAddComment();

  const {list = [], hasNextPage, fetchNextPage} = useComments(articleId);

  const onCommentsLayout = (event: LayoutChangeEvent) => {
    onLayout?.(event.nativeEvent.layout.y);
  };

  const onCommentNowPress = (comment: string) =>
    tryAddComment({
      comment,
      articleId,
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
      {list.map((d, i) => {
        const key = `${d.documentID}-${i}`;
        return <CommentItem item={d} key={key} theme={theme} />;
      })}
      {hasNextPage && (
        <View mt={4}>
          <SafeTouchable onPress={loadNextPage}>
            <Title>Load more comments</Title>
          </SafeTouchable>
        </View>
      )}
    </View>
  );
}

Comments.defaultProps = {
  onLayout: undefined,
};
