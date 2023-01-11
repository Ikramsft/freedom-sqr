/**
 * @format
 */
import React from 'react';
import {StyleProp} from 'react-native';
import {Image, View} from 'native-base';

import {AppTheme} from 'theme';
import {Button, Title, IProvider} from 'components';

import {getNewsProviderLogo, getNewsProviderBackground} from '../../../utils';
import BackImage from '../../../assets/images/provider.png';

const bgStyle: StyleProp<any> = {width: '100%', height: 160};
const logoStyle: StyleProp<any> = {width: '100%', height: '100%'};

interface Props {
  theme: AppTheme;
  provider: IProvider;
  isFollowing: boolean;
  isLoading: boolean;
  toggleFollow: () => void;
  onVisitWebsite: () => void;
}

export function NewsProviderHeader(props: Props) {
  const {
    theme,
    provider,
    isLoading,
    isFollowing,
    toggleFollow,
    onVisitWebsite,
  } = props;

  const {postProvider} = provider;
  const source = getNewsProviderLogo('news', postProvider);

  const bgSource = getNewsProviderBackground(postProvider);

  return (
    <View>
      <Image
        alt={postProvider}
        source={bgSource ?? BackImage}
        style={bgStyle}
      />
      <View
        height="75px"
        left={6}
        overflow="hidden"
        position="absolute"
        top="118px"
        width="75px">
        <Image alt={postProvider} source={source} style={logoStyle} />
      </View>
      <View pt={7} px={4}>
        <Title fontSize="lg" mt={4}>
          {postProvider}
        </Title>
        <View flexDirection="row" mt={2}>
          <Button
            backgroundColor={
              isFollowing ? theme.colors.maroon[900] : theme.colors.brand[950]
            }
            fontWeight="400"
            isLoading={isLoading}
            minWidth={120}
            size="xs"
            title={isFollowing ? 'UNFOLLOW' : 'FOLLOW'}
            onPress={toggleFollow}
          />
          <Button
            backgroundColor={theme.colors.transparent}
            borderColor={theme.colors.brand[950]}
            fontWeight="400"
            ml={2}
            size="xs"
            textColor={theme.colors.brand[950]}
            title="VISIT WEBSITE"
            variant="outline"
            onPress={onVisitWebsite}
          />
        </View>
      </View>
    </View>
  );
}
