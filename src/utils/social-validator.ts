import {SNSList, SNSRegex} from 'give-me-profile';

export const facebookProfileRegx = SNSRegex(SNSList.FACEBOOK_PROFILE);
export const facebookUsernameRegx = SNSRegex(SNSList.FACEBOOK_USERNAME);
export const instagramUsernameRegx = SNSRegex(SNSList.INSTAGRAM);
export const linkedinUsernameRegx = SNSRegex(SNSList.LINKEDIN);
export const twitterUsernameRegx = /^[a-zA-Z0-9_]{1,15}$/;
