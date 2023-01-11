/**
 * @format
 */
import React from 'react';
import {Text, View} from 'native-base';

import {useAppTheme} from 'theme';

export function TextIcon({name, color}: {name: string; color: string}) {
  const {colors} = useAppTheme();
  return (
    <View
      alignItems="center"
      backgroundColor={color}
      borderRadius={5}
      height={6}
      justifyContent="center"
      width={6}>
      <Text color={colors.white[900]} fontSize={12} fontWeight="700">
        {name.charAt(0).toUpperCase()}
      </Text>
    </View>
  );
}
