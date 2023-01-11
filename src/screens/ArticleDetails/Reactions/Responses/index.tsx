/**
 * @format
 */
import React from 'react';

import {SafeTouchable, SubTitle} from 'components';

import {formatCount} from '../../../../utils';
import {CommentIcon} from '../../../../assets/svg';
import {Container} from '../Container';

interface IResponseProps {
  commentCount: number;
  onPress?: () => void;
  isLoading: boolean;
}

export function Responses(props: IResponseProps) {
  const {isLoading, commentCount, onPress} = props;
  const likeText = formatCount(commentCount);
  const displayText =
    commentCount > 0
      ? `${likeText} ${commentCount > 1 ? 'Responses' : 'Response'} `
      : '0 Response';

  return (
    <SafeTouchable disabled={isLoading} onPress={onPress}>
      <Container>
        <CommentIcon />
        <SubTitle ml={2}>{displayText} </SubTitle>
      </Container>
    </SafeTouchable>
  );
}

Responses.defaultProps = {
  onPress: undefined,
};
