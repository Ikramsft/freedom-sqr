/**
 * @format
 */

import * as React from 'react';
import {IInputProps, Text, ITextProps} from 'native-base';
import {useWindowDimensions} from 'react-native';
import HTML, {
  defaultSystemFonts,
  TNodeChildrenRenderer,
} from 'react-native-render-html';
import {fontFamily} from '../../theme/theme';
import {useAppTheme} from '../../theme/useTheme';

function Caption(props: IInputProps) {
  const {children, ...rest} = props;

  return (
    <Text color="#818488" fontSize="sm" {...rest}>
      {children}
    </Text>
  );
}

function Title(props: IInputProps) {
  const {children, ...rest} = props;

  return (
    <Text color="black.700" fontSize="sm" fontWeight="bold" {...rest}>
      {children}
    </Text>
  );
}

function SubTitle(props: IInputProps) {
  const {children, ...rest} = props;

  return (
    <Text color="black.700" fontSize="sm" {...rest}>
      {children}
    </Text>
  );
}

function PRenderer({TDefaultRenderer, textProps, numberOfLines, ...props}) {
  const child = props.tnode.children.every(
    t => t.type === 'text' || t.type === 'phrasing',
  );
  const children = <TNodeChildrenRenderer tnode={props.tnode} />;
  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <TDefaultRenderer {...props} style={{padding: 0}}>
      {child ? (
        <Text numberOfLines={numberOfLines} {...textProps} fontSize="lg">
          {children}
        </Text>
      ) : (
        children
      )}
    </TDefaultRenderer>
  );
}

type HTMLProps = ITextProps & {
  size: number | string | undefined;
  numberOfLines: number | string | undefined;
};

function HTMLTextItem(props: HTMLProps) {
  const {children, size, numberOfLines, ...rest} = props;
  const html = React.useMemo(() => {
    if (typeof children !== 'string') {
      return '';
    }
    if (numberOfLines && numberOfLines > 0) {
      return children.substring(0, numberOfLines * 50); // Considering 50 characters per line
    }
    return children;
  }, [children, numberOfLines]);

  const {width} = useWindowDimensions();
  const {colors} = useAppTheme();
  const systemFonts = [...defaultSystemFonts, fontFamily.regular];
  return (
    <HTML
      contentWidth={width}
      renderers={{
        p: renderProps => (
          <PRenderer
            {...renderProps}
            numberOfLines={numberOfLines}
            textProps={rest}
          />
        ),
      }}
      source={{html}}
      systemFonts={systemFonts}
      tagsStyles={{
        body: {
          fontFamily: fontFamily.regular,
          fontSize: 12,
          lineHeight: 18,
        },
        a: {
          color: colors.blue[500],
          borderBottomColor: colors.blue[500],
        },
        p: {
          fontSize: size,
        },
      }}
    />
  );
}

const HTMLText = React.memo(HTMLTextItem);

export {Caption, Title, SubTitle, HTMLText};
