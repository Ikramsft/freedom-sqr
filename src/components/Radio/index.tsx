/**
 * @format
 */
import {Text} from 'native-base';
import React from 'react';
import {
  StyleProp,
  View,
  ViewStyle,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useAppTheme} from '../../theme/useTheme';

type ButtonProps = {
  selected: boolean;
  radioStyle?: StyleProp<ViewStyle>;
  checkedColor?: string;
  unCheckedColor?: string;
};

const RADIO_SIZE = 24;

function RadioButton(props: ButtonProps) {
  const {selected, checkedColor, unCheckedColor, radioStyle} = props;
  return (
    <View
      style={[
        styles.item,
        {borderColor: selected ? checkedColor : unCheckedColor},
        radioStyle,
      ]}>
      {selected ? (
        <View style={[styles.selectedItem, {backgroundColor: checkedColor}]} />
      ) : null}
    </View>
  );
}

RadioButton.defaultProps = {
  radioStyle: undefined,
  checkedColor: undefined,
  unCheckedColor: undefined,
};

interface RadioProps {
  checked: boolean;
  onChange?: () => void;
  label?: string;
  style?: StyleProp<ViewStyle>;
  radioStyle?: StyleProp<ViewStyle>;
  checkedColor?: string;
}

export function Radio(props: RadioProps) {
  const {checked, checkedColor, onChange, label, style, radioStyle} = props;

  const {colors} = useAppTheme();

  const Container = (onChange ? TouchableOpacity : View) as React.ElementType;

  return (
    <Container style={[styles.container, style]} onPress={onChange}>
      <RadioButton
        checkedColor={checkedColor || colors.gray[500]}
        radioStyle={radioStyle}
        selected={checked}
        unCheckedColor={colors.gray[500]}
      />
      {label ? (
        typeof label === 'string' ? (
          <Text style={styles.caption}>{label}</Text>
        ) : (
          label
        )
      ) : null}
    </Container>
  );
}

Radio.defaultProps = {
  label: '',
  style: {},
  radioStyle: {},
  onChange: undefined,
  checkedColor: undefined,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  caption: {
    marginLeft: 10,
    flexShrink: 1,
  },
  item: {
    height: RADIO_SIZE,
    width: RADIO_SIZE,
    borderRadius: RADIO_SIZE / 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedItem: {
    height: 12,
    width: 12,
    borderRadius: 6,
  },
});
