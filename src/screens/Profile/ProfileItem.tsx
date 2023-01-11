/**
 * @format
 */
import React from 'react';
import {View, Text, ChevronRightIcon} from 'native-base';

import {AppTheme} from 'theme';
import {SafeTouchable} from 'components';

type TitleType =
  | 'PAYMENT'
  | 'LOCATION'
  | 'INTERESTS'
  | 'PROVIDERS'
  | 'PROFILE'
  | 'BUSINESS'
  | 'INFORMATION'
  | 'IMAGES'
  | 'PAYMENT'
  | 'AFFILIATE'
  | 'PREFERENCES'
  | 'TERMS'
  | 'PRIVACY'
  | 'CORE_VALUES';

export type ContentType = {id: string; title: TitleType; label: string};

export interface ItemProps {
  item: ContentType;
  theme: AppTheme;
  arrow?: boolean;
  bottomBorder?: boolean;
  onPress?: (item: ContentType) => void;
  renderBottom?: JSX.Element | null;
  rightElement?: JSX.Element | null;
  disabled?: boolean;
}

export function ProfileItem(props: ItemProps) {
  const {
    arrow,
    item,
    theme,
    renderBottom,
    rightElement,
    bottomBorder,
    disabled,
    onPress,
  } = props;
  const onItemPress = () => onPress?.(item);

  return (
    <SafeTouchable
      disabled={disabled || !onPress}
      key={item.title}
      onPress={onItemPress}>
      <View
        borderBottomColor={theme.colors.gray[200]}
        borderBottomWidth={bottomBorder ? 1 : 0}
        mb={2}>
        <View
          flexDirection="row"
          justifyContent="space-between"
          justifyItems="center">
          <Text
            color={disabled ? theme.colors.gray[500] : theme.colors.black[900]}
            py={3}>
            {item.label}
          </Text>
          <View alignItems="center" flexDirection="row">
            {rightElement}
            {arrow && <ChevronRightIcon />}
          </View>
        </View>
        {renderBottom}
      </View>
    </SafeTouchable>
  );
}

ProfileItem.defaultProps = {
  onPress: undefined,
  arrow: true,
  renderBottom: undefined,
  rightElement: undefined,
  bottomBorder: true,
  disabled: false,
};
