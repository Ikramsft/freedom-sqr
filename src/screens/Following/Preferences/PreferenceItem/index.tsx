/**
 * @format
 */
import React, {useMemo} from 'react';
import {Text, View, Image} from 'native-base';
import _ from 'lodash';

import {useAppTheme} from 'theme';
import {SafeTouchable} from 'components';

import {AddCircleIcon, CheckCircleIcon} from '../../../../assets/svg';
import {getNewsProviderLogo} from '../../../../utils';

import {TextIcon} from './TextIcon';

interface Props {
  section: any;
  item: any;
  index: number;
  onToggleFollow: (id: string, type: string) => void;
  checked: boolean;
}

export function PreferenceItem(props: Props) {
  const {item, index, section, checked, onToggleFollow} = props;
  const {colors} = useAppTheme();

  const onItemToggle = () => {
    if (onToggleFollow) {
      onToggleFollow(item.documentId || item.documentID, section.type);
    }
  };

  const imageLogoURL = useMemo((): {uri?: string} | null => {
    let imageUrl = null;
    if (section.type === 'business') {
      imageUrl = {uri: item?.imageLogo?.croppedImageReadUrl || ''};
    }
    if (section.type === 'podcasts') {
      try {
        const images = JSON.parse(item.externalShowImages);
        if (images && images[0] && images[0].url) {
          // eslint-disable-next-line prefer-destructuring
          imageUrl = {uri: images[0].url};
        }
      } catch (error) {
        // console.log(error);
      }
    }
    if (section.type === 'providers') {
      imageUrl = getNewsProviderLogo('providers', item?.name);
    }

    return imageUrl;
  }, [
    item.externalShowImages,
    item?.imageLogo?.croppedImageReadUrl,
    item?.name,
    section.type,
  ]);

  return (
    <SafeTouchable
      testID={`preferences-item-${index}-${checked ? 'checked' : 'unchecked'}`}
      onPress={onItemToggle}>
      <View
        alignItems="center"
        flexDirection="row"
        justifyContent="center"
        px={2}
        py={1}
        width="full">
        {imageLogoURL &&
        (_.isNumber(imageLogoURL) || imageLogoURL?.uri !== '') ? (
          <Image
            alt="provider-logo"
            borderRadius={5}
            height={6}
            source={imageLogoURL}
            width={6}
          />
        ) : (
          <TextIcon color={colors.maroon[900]} name={item.name} />
        )}

        <View
          alignItems="flex-start"
          flex={1}
          flexDirection="column"
          justifyContent="center"
          px={4}>
          <Text fontSize={12}>{item.name}</Text>
        </View>
        {section.checkbox ? (
          checked ? (
            <CheckCircleIcon />
          ) : (
            <AddCircleIcon />
          )
        ) : null}
      </View>
    </SafeTouchable>
  );
}
