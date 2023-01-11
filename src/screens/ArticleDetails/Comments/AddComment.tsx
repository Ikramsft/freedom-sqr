/**
 * @format
 */
import * as React from 'react';
import {View} from 'native-base';
import {IViewProps} from 'native-base/lib/typescript/components/basic/View/types';

import {TextField, Button, Title, UserAvatar} from 'components';

import {useUserInfo} from '../../../hooks/useUserInfo';
import {closeKeyboard} from '../../../utils';
import {InfluencerTickIcon} from '../../../assets/svg';

interface Props extends IViewProps {
  isLoading: boolean;
  onAddComment?: (comment: string) => void;
}

export type IAddCommentHandler = {
  resetComment: () => void;
};

const AddComment = React.forwardRef<IAddCommentHandler, Props>(
  (props: Props, ref) => {
    React.useImperativeHandle(ref, () => ({resetComment: onSuccess}));

    const {user, authenticated} = useUserInfo();
    const {isLoading, onAddComment, ...rest} = props;

    const [comment, setComment] = React.useState<string>('');

    if (!authenticated) {
      return null;
    }

    const onSuccess = () => {
      setComment('');
      closeKeyboard();
    };

    const onCommentNowPress = () => onAddComment?.(comment);

    return (
      <View
        {...rest}
        borderColor="gray.400"
        borderRadius={5}
        borderWidth={1}
        key="AddComment"
        padding={3}>
        <View alignItems="center" flexDirection="row" mt={2}>
          <UserAvatar profilePic={user.croppedImageReadUrl} />
          <View alignItems="center" flexDirection="row">
            <Title ml={2} mr={2}>
              {user?.fullName ?? user.userName}
            </Title>
            {user?.influencerStatus && (
              <InfluencerTickIcon height={16} width={16} />
            )}
          </View>
        </View>
        <TextField
          multiline
          maxLength={1000}
          mt={3}
          numberOfLines={5}
          placeholder="Share your comment…"
          textAlignVertical="top"
          value={comment}
          variant="unstyled"
          onChangeText={setComment}
        />
        <View flexDirection="row" justifyContent="flex-end" mt={2}>
          <View alignItems="center" flexDirection="row">
            <View justifyContent="center" mr={3}>
              <Button
                colorScheme="brand"
                size="sm"
                textColor="brand.900"
                title="CANCEL"
                variant="ghost"
                onPress={() => setComment('')}
              />
            </View>
            <View justifyContent="center">
              <Button
                disabled={!comment.trim().length || isLoading}
                isLoading={isLoading}
                size="sm"
                title="RESPOND"
                width={100}
                onPress={onCommentNowPress}
              />
            </View>
          </View>
        </View>
      </View>
    );
  },
);

AddComment.defaultProps = {
  onAddComment: undefined,
};

export {AddComment};
