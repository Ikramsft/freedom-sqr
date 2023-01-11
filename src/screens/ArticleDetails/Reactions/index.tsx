/**
 * @format
 */
import React from 'react';
import {View} from 'native-base';
import {IViewProps} from 'native-base/lib/typescript/components/basic/View/types';

import {Like} from './Like';
import {Responses} from './Responses';
import {Share} from './Share';
import {AppTheme} from '../../../theme/theme';

interface IReactionProps extends IViewProps {
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  theme: AppTheme;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
}

export function Reactions(props: IReactionProps) {
  const {
    likeCount,
    commentCount,
    onLike,
    onComment,
    onShare,
    isLiked,
    theme,
    ...rest
  } = props;

  return (
    <View mt={4} {...rest}>
      <View flexDirection="row">
        <Like
          isLiked={isLiked}
          isLoading={false}
          likesCount={likeCount}
          theme={theme}
          onPress={onLike}
        />
        <View ml={2}>
          <Responses
            commentCount={commentCount}
            isLoading={false}
            onPress={onComment}
          />
        </View>
        <View ml={2}>
          <Share onPress={onShare} />
        </View>
      </View>
    </View>
  );
}

Reactions.defaultProps = {
  onLike: undefined,
  onComment: undefined,
  onShare: undefined,
};
