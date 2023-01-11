import React from 'react';
import {StyleSheet} from 'react-native';
import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewProps,
} from 'react-native-keyboard-aware-scroll-view';
import {KEYBOARD_EXTRA_HEIGHT} from '../../constants';

function ScrollView(props: KeyboardAwareScrollViewProps) {
  const {children, ...rest} = props;

  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      contentContainerStyle={styles.content}
      extraHeight={KEYBOARD_EXTRA_HEIGHT}
      keyboardShouldPersistTaps="handled"
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      style={styles.scrollView}
      {...rest}>
      {children}
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
});

export {ScrollView};
