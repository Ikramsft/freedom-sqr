import React, {useCallback, useState} from 'react';
import {Text, View} from 'native-base';

import {useAppTheme} from 'theme';
import {Button, SafeTouchable, ProgressImage} from 'components';

import {IBusinessItem} from '../Queries/useBusinessTab';
import {useBusinessActions} from '../Queries/useBusinessActions';
import {useUserInfo} from '../../../hooks/useUserInfo';
import {navigate} from '../../../navigation/navigationRef';
import {Images} from '../../../assets/images';

interface IBusinessItemProps {
  item: IBusinessItem;
  onSelect?: (item: IBusinessItem) => void;
}

function BusinessItem(props: IBusinessItemProps) {
  const theme = useAppTheme();
  const {authenticated: isLoggedIn} = useUserInfo();
  const {item, onSelect} = props;
  const {documentId, isFollowing: initialFollows, imageLogo, role} = item;
  const [isFollowing, setIsFollowing] = useState(Boolean(initialFollows));
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  const {tryFollowBusiness, tryUnfollowBusiness} = useBusinessActions();

  const onBusinessPress = () => onSelect?.(item);

  const onSuccess = useCallback(
    (success: boolean) => {
      if (success) {
        setIsFollowing(!isFollowing);
      }
      setIsFollowLoading(false);
    },
    [isFollowing],
  );

  const follow = () => {
    if (isLoggedIn) {
      setIsFollowLoading(true);
      tryFollowBusiness(documentId, onSuccess);
    } else {
      navigate('Login');
    }
  };

  const unfollow = () => {
    if (isLoggedIn) {
      setIsFollowLoading(true);
      tryUnfollowBusiness(documentId, onSuccess);
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

  const navigateToBusinessWall = () => {
    navigate('BusinessDetail', {businessId: documentId});
  };

  const source =
    imageLogo.croppedImageReadUrl === ''
      ? Images.business_placeholder
      : {uri: imageLogo.croppedImageReadUrl};

  const key = `business-item-${item.documentId}-${item.isFollowing}`;

  return (
    <View key={key} px={2} width="100%">
      <SafeTouchable onPress={onBusinessPress}>
        <View borderColor="gray.500" borderRadius={5} borderWidth={1} mt={4}>
          <ProgressImage
            borderRadius={5}
            height="150px"
            source={source}
            width="100%"
          />
        </View>
        <View>
          <Text
            color={theme.colors.black[600]}
            fontSize={16}
            fontWeight="bold"
            numberOfLines={2}>
            {item?.name}
          </Text>
          <Text
            color={theme.colors.brand[600]}
            minHeight={70}
            mt={1}
            numberOfLines={3}>
            {item?.description}
          </Text>
        </View>
        <View borderBottomColor="gray.500" borderBottomWidth={1} my={3} />
      </SafeTouchable>
      {role !== 'owner' ? (
        <Button
          backgroundColor={
            isFollowing ? theme.colors.maroon[900] : theme.colors.brand[950]
          }
          fontWeight="400"
          isDisabled={isFollowLoading}
          isLoading={isFollowLoading}
          mx={3}
          title={isFollowing ? 'UNFOLLOW' : 'FOLLOW'}
          onPress={toggleFollow}
        />
      ) : (
        <Button
          backgroundColor={theme.colors.brand[950]}
          fontWeight="400"
          mx={3}
          title="My Business"
          onPress={navigateToBusinessWall}
        />
      )}
    </View>
  );
}
BusinessItem.defaultProps = {
  onSelect: undefined,
};

export default React.memo(BusinessItem);
