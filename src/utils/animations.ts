import {Animated, StyleProp, ViewStyle} from 'react-native';
import {
  CarouselProps,
  getInputRangeFromIndexes,
} from 'react-native-snap-carousel-v4';

export function scrollInterpolator(
  index: number,
  carouselProps: CarouselProps<any>,
): {inputRange: number[]; outputRange: number[]} {
  const range = [1, 0, -1];
  const inputRange = getInputRangeFromIndexes(range, index, carouselProps);
  const outputRange = range;

  return {inputRange, outputRange};
}

export function animatedStyles(
  index: number,
  animatedValue: Animated.AnimatedValue,
  carouselProps: CarouselProps<any>,
): StyleProp<ViewStyle> {
  let animatedOpacity = {};
  let animatedTransform = {};

  if (carouselProps.inactiveSlideOpacity < 1) {
    animatedOpacity = {
      opacity: animatedValue.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: [
          carouselProps.inactiveSlideOpacity,
          1,
          carouselProps.inactiveSlideOpacity,
        ],
      }),
    };
  }

  if (carouselProps.inactiveSlideScale < 1) {
    animatedTransform = {
      transform: [],
    };
  }

  return {
    ...animatedOpacity,
    ...animatedTransform,
  };
}
