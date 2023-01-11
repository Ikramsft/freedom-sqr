/**
 * @format
 */
import React from 'react';

import {SafeTouchable, SubTitle} from 'components';

import {ShareIcon} from '../../../../assets/svg';
import {Container} from '../Container';

interface IShareProps {
  onPress?: () => void;
}

export function Share(props: IShareProps) {
  const {onPress} = props;
  return (
    <SafeTouchable onPress={onPress}>
      <Container>
        <ShareIcon />
        <SubTitle ml={2}>Share</SubTitle>
      </Container>
    </SafeTouchable>
  );
}

Share.defaultProps = {
  onPress: undefined,
};
