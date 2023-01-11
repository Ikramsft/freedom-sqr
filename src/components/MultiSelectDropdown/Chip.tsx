/* eslint-disable no-underscore-dangle */
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
  StyleProp,
  TextStyle,
  PixelRatio,
} from 'react-native';

interface ISizes {
  CHIP_HEIGHT: number;
  CHIP_RADIUS: number;
  CHIP_MARGIN: number;
  CHIP_TEXT_SIZE: number;
  CHIP_TEXT_MARGIN: number;
  CHIP_LEFT_ICON_SIZE: number;
  CHIP_LEFT_ICON_RADIUS: number;
  CHIP_RIGHT_ICON_SIZE: number;
  CHIP_RIGHT_ICON_RADIUS: number;
}

interface MaterialChipProps extends ViewProps {
  text: string;
  onPress?: () => void;
  leftIcon?: any;
  rightIcon?: any;
  onDelete?: () => void;
  textStyle?: StyleProp<TextStyle>;
}

export const Sizes: ISizes = {
  CHIP_HEIGHT: PixelRatio.roundToNearestPixel(32),
  CHIP_RADIUS: PixelRatio.roundToNearestPixel(16),
  CHIP_MARGIN: PixelRatio.roundToNearestPixel(4),
  CHIP_TEXT_SIZE: PixelRatio.roundToNearestPixel(14),
  CHIP_TEXT_MARGIN: PixelRatio.roundToNearestPixel(16),
  CHIP_LEFT_ICON_SIZE: PixelRatio.roundToNearestPixel(24),
  CHIP_LEFT_ICON_RADIUS: PixelRatio.roundToNearestPixel(12),
  CHIP_RIGHT_ICON_SIZE: PixelRatio.roundToNearestPixel(18),
  CHIP_RIGHT_ICON_RADIUS: PixelRatio.roundToNearestPixel(9),
};

const MaterialChip: React.FC<MaterialChipProps> = React.memo(props => {
  // Render the right icon
  const _renderRightIcon = (icon: any) => {
    return (
      <View
        style={{
          height: Sizes.CHIP_RIGHT_ICON_SIZE,
          width: Sizes.CHIP_RIGHT_ICON_SIZE,
          borderRadius: Sizes.CHIP_RIGHT_ICON_RADIUS,
        }}>
        {icon}
      </View>
    );
  };

  // Render the right icon touchable
  const _checkRightIconTouch = () => {
    // If onDelete function is passed it renders the touchable component
    return (
      <TouchableOpacity onPress={() => props.onDelete?.()}>
        {_renderRightIcon(props.rightIcon)}
      </TouchableOpacity>
    );

    return null;
  };

  // Render the left icon
  const _renderLeftIcon = (icon: any) => {
    return (
      <View
        style={{
          height: Sizes.CHIP_LEFT_ICON_SIZE,
          width: Sizes.CHIP_LEFT_ICON_SIZE,
          borderRadius: Sizes.CHIP_LEFT_ICON_RADIUS,
        }}>
        {icon}
      </View>
    );
  };

  const _renderContent = () => {
    const textStyleProp = props.textStyle !== undefined ? props.textStyle : {};

    return (
      <View style={chipStyle.chipContainer}>
        {props.leftIcon ? (
          <View
            style={{
              marginLeft: PixelRatio.roundToNearestPixel(4),
              marginRight: PixelRatio.roundToNearestPixel(8),
            }}>
            {_renderLeftIcon(props.leftIcon)}
          </View>
        ) : null}
        <Text
          style={[
            // eslint-disable-next-line react-native/no-inline-styles
            {
              fontSize: Sizes.CHIP_TEXT_SIZE,
              marginRight:
                props.rightIcon || props.onDelete ? 0 : Sizes.CHIP_TEXT_MARGIN,
              marginLeft: props.leftIcon ? 0 : Sizes.CHIP_TEXT_MARGIN,
              color: 'rgba(0, 0, 0, 0.87)',
            },
            textStyleProp,
          ]}>
          {props.text}
        </Text>
        {props.rightIcon ? (
          <View
            style={{
              marginLeft: PixelRatio.roundToNearestPixel(8),
              marginRight: PixelRatio.roundToNearestPixel(8),
            }}>
            {_checkRightIconTouch()}
          </View>
        ) : null}
      </View>
    );
  };

  const styleProp = props.style !== undefined ? props.style : {};

  if (props.onPress !== undefined) {
    return (
      <TouchableOpacity onPress={() => props.onPress?.()}>
        <View
          style={[
            styleProp,
            chipStyle.mainContainer,
            {
              marginLeft: Sizes.CHIP_MARGIN,
              marginRight: Sizes.CHIP_MARGIN,
            },
          ]}>
          {_renderContent()}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={[
        styleProp,
        chipStyle.mainContainer,
        {
          marginLeft: Sizes.CHIP_MARGIN,
          marginRight: Sizes.CHIP_MARGIN,
        },
      ]}>
      {_renderContent()}
    </View>
  );
});

export const chipStyle = StyleSheet.create({
  mainContainer: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    minHeight: Sizes.CHIP_HEIGHT,
    borderRadius: Sizes.CHIP_RADIUS,
    borderColor: '#C4C4C4',
    margin: Sizes.CHIP_MARGIN,
  },
  chipContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export {MaterialChip};
