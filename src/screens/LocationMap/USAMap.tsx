import {View} from 'native-base';
import * as React from 'react';
import Svg, {G, Path} from 'react-native-svg';

import {useAppTheme} from '../../theme/useTheme';
import {svgData} from './svgData';

interface IUSAMap {
  selected: string;
  onSelect: (name: string) => void;
}

function USAMap(props: IUSAMap) {
  const {onSelect, selected} = props;
  const theme = useAppTheme();
  return (
    <View height={300}>
      <Svg
        height="900"
        id="svg5249"
        viewBox="0 0 959 2103"
        width="100%"
        xmlns="http://www.w3.org/2000/svg">
        <G>
          {svgData.map(i => {
            return (
              <Path
                d={i?.dimensions}
                fill={
                  selected === i?.name
                    ? theme.colors.red[900]
                    : theme.colors.white[900]
                }
                id={i?.abbreviation}
                opacity="0.5"
                onPress={() => onSelect(i?.name)}
              />
            );
          })}
        </G>
      </Svg>
    </View>
  );
}

export default USAMap;
