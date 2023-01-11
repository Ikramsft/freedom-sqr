/**
 * @format
 */
import React from 'react';
import {IViewProps} from 'native-base/lib/typescript/components/basic/View/types';

import {AppTheme} from 'theme';
import {SafeTouchable, SubTitle} from 'components';

import {formatCount} from '../../../../utils';
import {LikePlainIcon, LikeColorIcon} from '../../../../assets/svg';
import {Container} from '../Container';

interface ILikeProps extends IViewProps {
  likesCount: number;
  onPress?: () => void;
  isLoading: boolean;
  isLiked: boolean;
  theme: AppTheme;
}

export function Like(props: ILikeProps) {
  const {isLoading, likesCount, onPress, isLiked, theme, ...rest} = props;
  const likeText = formatCount(likesCount);
  const displayText =
    likesCount > 0
      ? `${likeText} ${likesCount > 1 ? 'Likes' : 'Like'} `
      : '0 Like';

  return (
    <SafeTouchable disabled={isLoading} onPress={onPress}>
      <Container minWidth="75px" {...rest}>
        {isLiked ? <LikeColorIcon /> : <LikePlainIcon />}
        <SubTitle
          color={isLiked ? theme?.colors?.blue[500] : theme?.colors?.black[700]}
          ml={2}>
          {displayText}
        </SubTitle>
      </Container>
    </SafeTouchable>
  );
}

Like.defaultProps = {
  onPress: undefined,
};
