import {View, Text} from 'native-base';
import React from 'react';

import {AppTheme} from 'theme';
import {SafeTouchable} from 'components';

interface IShowMore {
  handleShowMore: () => void;
  theme: AppTheme;
}

function ShowMore(props: IShowMore) {
  const {handleShowMore, theme} = props;
  return (
    <View alignSelf="flex-end" mt={2} mx={2} width={100}>
      <SafeTouchable onPress={handleShowMore}>
        <Text
          color={theme.colors.brand[950]}
          fontWeight="bold"
          textAlign="center">
          Show more...
        </Text>
      </SafeTouchable>
    </View>
  );
}

export default ShowMore;
