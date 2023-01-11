/**
 * @format
 */
import React from 'react';
import {Text, View} from 'native-base';
import {StyleSheet} from 'react-native';
import {IItem} from 'native-base/lib/typescript/components/composites/Typeahead/useTypeahead/types';

import {useAppTheme} from 'theme';
import {Button, SafeTouchable} from 'components';

interface Props {
  navigation: IItem;
}

function SignUpBox(props: Props) {
  const theme = useAppTheme();
  const {navigation} = props;

  const onSignUp = () => {
    navigation.navigate('Signup');
  };
  return (
    <SafeTouchable activeOpacity={0.8}>
      <View bgColor={theme.colors.brand[600]} borderRadius={5} margin={5}>
        <View style={styles.textBox}>
          <Text color={theme.colors.white[900]} textAlign="center">
            Connect with the viewers that align with your business.
          </Text>
        </View>
        <View ml={10} mr={10}>
          <Button
            bgColor={theme.colors.white[900]}
            fontWeight="light"
            mt={3}
            textColor={theme.colors.black[900]}
            title="SIGN UP"
            onPress={onSignUp}
          />
        </View>
        <View style={styles.textBox}>
          <Text color={theme.colors.white[900]}>
            Want more information? Learn More
          </Text>
        </View>
      </View>
    </SafeTouchable>
  );
}

const styles = StyleSheet.create({
  textBox: {
    alignSelf: 'center',
    margin: 10,
    paddingHorizontal: 30,
  },
});

export {SignUpBox};
