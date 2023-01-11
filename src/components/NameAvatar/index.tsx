/**
 * @format
 */
import React from 'react';
import {Text, View} from 'native-base';
import {IViewProps} from 'native-base/lib/typescript/components/basic/View/types';

import {useAppTheme} from 'theme';

interface UserAvatarProps extends IViewProps {
  name: string;
}

function NameAvatar(props: UserAvatarProps) {
  const {name, ...rest} = props;

  const {colors} = useAppTheme();

  return (
    <View
      alignItems="center"
      backgroundColor={colors.brand[950]}
      justifyContent="center"
      size={6}
      {...rest}>
      <Text color={colors.white[900]} fontSize="md">
        {name.charAt(0).toUpperCase()}
      </Text>
    </View>
  );
}

export {NameAvatar};
