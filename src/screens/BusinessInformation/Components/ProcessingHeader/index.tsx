/**
 * @format
 */
import React from 'react';
import {View} from 'native-base';

import {useAppTheme} from 'theme';
import {Title} from 'components';

export function ProcessingHeader() {
  const theme = useAppTheme();
  return (
    <View backgroundColor={theme.colors.gray[500]} pt={2} px={4}>
      <Title fontSize="md" mb={2}>
        We are in process of reviewing your request.
      </Title>
    </View>
  );
}
