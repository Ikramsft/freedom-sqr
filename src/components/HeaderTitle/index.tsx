/**
 * @format
 */
import React from 'react';
import {TextStyle, View, Text, StyleSheet} from 'react-native';

interface IHeaderTitleProps {
  title?: string;
  LeftElement?: JSX.Element | JSX.Element[] | undefined;
  RightElement?: JSX.Element | JSX.Element[] | undefined;
  render?: JSX.Element | JSX.Element[] | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  titleTextProps?: any;
  style?: TextStyle | undefined;
}

const maxLength = 30;

function HeaderTitle(props: IHeaderTitleProps) {
  const {title, LeftElement, RightElement, render, titleTextProps, ...others} =
    props;

  if (render) {
    return <View {...others}>{render}</View>;
  }

  const displayTitle =
    title && title.length >= maxLength
      ? `${title.slice(0, maxLength)}...`
      : title;

  return (
    <View style={styles.container} {...others}>
      {LeftElement}
      <Text style={styles.headerTitle} {...titleTextProps}>
        {displayTitle}
      </Text>
      {RightElement}
    </View>
  );
}

HeaderTitle.defaultProps = {
  title: '',
  LeftElement: undefined,
  RightElement: undefined,
  render: undefined,
  titleTextProps: undefined,
  style: undefined,
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
});
export {HeaderTitle};
