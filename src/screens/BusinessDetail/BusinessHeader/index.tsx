/**
 * @format
 */
import React from 'react';
import {Divider, Text, View} from 'native-base';

import {AppTheme} from 'theme';
import {
  Button,
  ReadMoreLessText,
  Title,
  SubTitle,
  ProgressImage,
} from 'components';

import {IBusinessInfo} from '../../BusinessInformation/useBusinessInfo';
import {openInAppBrowser} from '../../../utils';
import {useUserInfo} from '../../../hooks/useUserInfo';
import {navigate} from '../../../navigation/navigationRef';
import {useBusinessActions} from '../../BusinessTab/Queries/useBusinessActions';

interface Props {
  info: IBusinessInfo;
  theme: AppTheme;
}

export const BusinessHeader = React.memo(BusinessHeaderView);

function BusinessHeaderView(props: Props) {
  const {info, theme} = props;
  const {authenticated: isLoggedIn} = useUserInfo();
  const {
    name,
    tagline,
    images,
    website,
    description,
    documentId,
    businessCategories,
    isFollowing,
    role,
  } = info;

  const {isLoading, tryFollowBusiness, tryUnfollowBusiness} =
    useBusinessActions();

  const onVisitWebsite = () => openInAppBrowser(website);

  const follow = () => {
    if (isLoggedIn) {
      tryFollowBusiness(documentId);
    } else {
      navigate('Login');
    }
  };

  const unfollow = () => {
    if (isLoggedIn) {
      tryUnfollowBusiness(documentId);
    } else {
      navigate('Login');
    }
  };

  const toggleFollow = () => {
    if (isFollowing) {
      unfollow();
    } else {
      follow();
    }
  };

  const categoryText = businessCategories?.map(x => x.name).join(', ');

  return (
    <View>
      <ProgressImage
        borderRadius={0}
        height="160px"
        key={documentId}
        source={{uri: images.background.croppedImageReadUrl}}
        width="100%"
      />
      <View
        height="75px"
        left={6}
        overflow="hidden"
        position="absolute"
        top="118px"
        width="75px">
        <ProgressImage
          borderRadius={5}
          height="100%"
          source={{uri: images.logo.croppedImageReadUrl}}
          width="100%"
        />
      </View>
      <View pt={7} px={4}>
        <Title fontSize="md" mt={2}>
          {name}
        </Title>
        <SubTitle fontSize="md">{tagline}</SubTitle>
        <Text>{categoryText}</Text>
        <View flexDirection="row" mt={2}>
          {role !== 'owner' && (
            <Button
              backgroundColor={
                isFollowing ? theme.colors.maroon[900] : theme.colors.brand[950]
              }
              fontWeight="400"
              isDisabled={isLoading}
              isLoading={isLoading}
              minWidth={120}
              mr={2}
              size="xs"
              title={isFollowing ? 'UNFOLLOW' : 'FOLLOW'}
              onPress={toggleFollow}
            />
          )}
          <Button
            backgroundColor={theme.colors.transparent}
            borderColor={theme.colors.brand[950]}
            fontWeight="400"
            size="xs"
            textColor={theme.colors.brand[950]}
            title="VISIT WEBSITE"
            variant="outline"
            onPress={onVisitWebsite}
          />
        </View>
        <Divider height="1px" mt={4} />
        <View mt={2}>
          <Title fontSize="md">About</Title>
          <ReadMoreLessText my={1} visibleLines={3}>
            {description}
          </ReadMoreLessText>
        </View>
        <Divider height="1px" mt={2} />
      </View>
    </View>
  );
}
