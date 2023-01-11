import gPhoneNumber from 'google-libphonenumber';

const phoneUtil = gPhoneNumber.PhoneNumberUtil.getInstance();

export interface CustomYupContext<T> {
  from: {
    value: T;
  }[];
}

export function validatePhoneWithYup(
  countryCode: string,
  phone: string,
  strict = false,
) {
  // This is fix from our app supported countries values i.e. +91/+1
  if (countryCode === '+91') {
    countryCode = 'IN';
  } else if (countryCode === '+1') {
    countryCode = 'US';
  }

  try {
    const phoneNumber = phoneUtil.parseAndKeepRawInput(phone, countryCode);

    if (!phoneUtil.isPossibleNumber(phoneNumber)) {
      return false;
    }

    const regionCodeFromPhoneNumber =
      phoneUtil.getRegionCodeForNumber(phoneNumber);

    // check if the countryCode provided should be used as default country code or strictly followed
    return strict
      ? phoneUtil.isValidNumberForRegion(phoneNumber, countryCode)
      : phoneUtil.isValidNumberForRegion(
          phoneNumber,
          regionCodeFromPhoneNumber,
        );
  } catch {
    return false;
  }
}
