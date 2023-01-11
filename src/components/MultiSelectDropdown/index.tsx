/**
 * @format
 */
import React from 'react';
import {
  CheckIcon,
  ISelectProps,
  View,
  Actionsheet,
  useDisclose,
  ScrollView,
  ChevronDownIcon,
} from 'native-base';
import {isArray} from 'lodash';
import {Keyboard} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import {TextField, SafeTouchable, Button} from 'components';

import {SubTitle} from '../Typography';
import {toggleElement} from '../../utils';
import {MaterialChip, Sizes} from './Chip';
import {useAppTheme} from '../../theme/useTheme';

type Option = {
  label: string;
  value: string;
  disabled?: boolean;
};

interface Props extends ISelectProps {
  error: string | string[] | undefined;
  values: string[];
  list: Option[];
  maxLength?: number;
  onSelect?: (value: string[]) => void;
  onBlur?: () => void;
  label?: string;
}

function MultiSelectDropdown(props: Props) {
  const {
    label,
    placeholder,
    values,
    list,
    error,
    onSelect,
    onBlur,
    maxLength = 9999,
  } = props;

  const theme = useAppTheme();

  const {isOpen, onOpen, onClose} = useDisclose();

  const [selected, setSelected] = React.useState<string[]>(values);

  React.useEffect(() => {
    setSelected(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const onItemCheck = (item: string) => {
    setSelected(toggleElement(selected, item));
  };

  const onApply = () => {
    onSelect?.(selected);
    onClose();
  };

  const value = values.length
    ? `${values.length} ${values.length > 1 ? 'categories' : 'category'}`
    : '';

  const onOpenDropdown = () => {
    Keyboard.dismiss();
    onOpen();
  };

  const onCloseDropdown = () => {
    onBlur?.();
    onClose();
  };

  const onClickChip = (item: string) => {
    const updatedSelected = toggleElement(selected, item);
    setSelected(updatedSelected);
    onSelect?.(updatedSelected);
  };

  const selectedValues = list.filter(l => values?.includes(l.value));

  return (
    <View>
      <SafeTouchable activeOpacity={0.9} onPress={onOpenDropdown}>
        <TextField
          backgroundColor={theme.colors.white[900]}
          caretHidden={false}
          editable={false}
          error={error ? (isArray(error) ? error[0] : error) : undefined}
          label={label}
          placeholder={placeholder}
          pointerEvents="none"
          rightElement={
            <View pr={3}>
              <ChevronDownIcon size="25px" />
            </View>
          }
          value={value}
        />
      </SafeTouchable>
      {selectedValues.length ? (
        <ScrollView horizontal my={2} showsHorizontalScrollIndicator={false}>
          {selectedValues.map((l, index) => {
            const key = `material_chip_${l.value}_${index}`;
            return (
              <MaterialChip
                key={key}
                rightIcon={
                  <MaterialIcon
                    name="close-circle"
                    size={Sizes.CHIP_RIGHT_ICON_SIZE}
                  />
                }
                text={l.label}
                onDelete={() => onClickChip(l.value)}
                onPress={() => onClickChip(l.value)}
              />
            );
          })}
        </ScrollView>
      ) : null}
      <Actionsheet isOpen={isOpen} onClose={onCloseDropdown}>
        <Actionsheet.Content key="multi-select">
          <View px={2} width="full">
            <ScrollView maxHeight="500" width="full">
              {list.map(l => {
                const isChecked = selected?.includes(l.value);
                const onItemPress = () => {
                  if (isChecked) {
                    onItemCheck(l.value);
                    return;
                  }
                  if (selected.length < maxLength) {
                    onItemCheck(l.value);
                  }
                };
                const key = `${l.label}-${l.value}`;
                return (
                  <SafeTouchable key={key} onPress={onItemPress}>
                    <View
                      flexDirection="row"
                      justifyContent="space-between"
                      minHeight="40px">
                      <SubTitle fontSize="md">{l.label}</SubTitle>
                      {isChecked && <CheckIcon />}
                    </View>
                  </SafeTouchable>
                );
              })}
            </ScrollView>
            <Button
              alignSelf="center"
              title="Select"
              width="48%"
              onPress={onApply}
            />
          </View>
        </Actionsheet.Content>
      </Actionsheet>
    </View>
  );
}

MultiSelectDropdown.defaultProps = {
  onSelect: undefined,
  onBlur: undefined,
  maxLength: 9999,
  label: undefined,
};

export {MultiSelectDropdown};
