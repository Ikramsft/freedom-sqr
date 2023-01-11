/**
 * @format
 */
import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {View} from 'native-base';

import {useAppTheme} from 'theme';
import {SafeTouchable} from 'components';

import Logo from '../../assets/images/logo.png';

interface Props {
  onPress?: () => void;
}

export function Header(props: Props) {
  const theme = useAppTheme();

  const {onPress} = props;

  return (
    <SafeTouchable activeOpacity={0.9} onPress={onPress}>
      <View
        bg={theme.colors.brand[600]}
        justifyContent="center"
        style={styles.root}>
        <Image source={Logo} style={styles.img} />
      </View>
    </SafeTouchable>
  );
}

Header.defaultProps = {
  onPress: undefined,
};

const styles = StyleSheet.create({
  root: {
    height: 70,
    width: '100%',
  },
  img: {
    width: 220,
    height: 40,
    position: 'absolute',
    alignSelf: 'center',
  },
});
