/**
 * @format
 */
import React from 'react';
import {IInputProps, Text, View} from 'native-base';

interface Props extends IInputProps {
  visibleLines?: number;
}

export function ReadMoreLessText(props: Props) {
  const {children, visibleLines, ...rest} = props;

  const [readMore, setReadMore] = React.useState(false);
  const [lengthMore, setLengthMore] = React.useState(false);

  const onTextLayout = React.useCallback(
    (e: {nativeEvent: {lines: string | any[]}}) => {
      setLengthMore(e.nativeEvent.lines.length >= (visibleLines ?? 4));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const toggleNumberOfLines = () => setReadMore(!readMore);

  return (
    <View>
      <Text
        color="black.900"
        fontSize="sm"
        fontWeight="light"
        numberOfLines={readMore ? 0 : visibleLines}
        onTextLayout={onTextLayout}
        {...rest}>
        {children}
      </Text>
      {lengthMore && (
        <Text fontWeight="bold" opacity={1} onPress={toggleNumberOfLines}>
          {readMore ? 'Read less...' : 'Read more...'}
        </Text>
      )}
    </View>
  );
}

ReadMoreLessText.defaultProps = {
  visibleLines: 2,
};
