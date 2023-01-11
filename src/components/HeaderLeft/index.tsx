/**
 * @format
 */
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

import {SafeTouchable} from '../SafeTouchable';

interface IHeaderLeftProps {
  onPress?: () => void;
}

function HeaderLeft(props: IHeaderLeftProps) {
  const {onPress} = props;

  return (
    <SafeTouchable activeOpacity={0.9} onPress={onPress}>
      <View style={styles.container}>
        <Feather name="chevron-left" size={25} />
        <Text>Back</Text>
      </View>
    </SafeTouchable>
  );
}

HeaderLeft.defaultProps = {
  onPress: null,
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: 35,
    justifyContent: 'center',
    flexDirection: 'row',
    width: 35,
  },
});

export {HeaderLeft};
