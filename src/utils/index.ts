/**
 * @format
 */
import {Linking, Keyboard} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import gPhoneNumber from 'google-libphonenumber';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {Images, ImagesType} from '../assets/images';
import {monthNames, SCREEN_HEIGHT, SCREEN_WIDTH} from '../constants';
import {BusinessSteps} from '../screens/BusinessInformation/useBusinessInfo';
import {
  ProviderThumbs,
  ThumbImagesType,
} from '../assets/images/providers/provider-thumbs';
import {ProviderBG, BGImagesType} from '../assets/images/providers/provider-bg';

const phoneUtil = gPhoneNumber.PhoneNumberUtil.getInstance();
const PNF = gPhoneNumber.PhoneNumberFormat;

export function formatPhoneNumber(phoneNumberString: string | undefined) {
  if (phoneNumberString) {
    try {
      const number = phoneUtil.parseAndKeepRawInput(phoneNumberString, 'US');
      if (phoneUtil.isPossibleNumber(number)) {
        const formattedNo = phoneUtil.format(number, PNF.NATIONAL);
        return formattedNo;
      }
      return handleMaskToUSNumber(phoneNumberString);
    } catch {
      return handleMaskToUSNumber(phoneNumberString);
    }
  }
  return phoneNumberString;
}

export const handleMaskToUSNumber = (value: string): string => {
  if (value) {
    const n = value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    let maskedNumber = '';
    if (n) {
      maskedNumber = !n[2]
        ? n[1]
        : `(${n[1]}) ${n[2]}${n[3] ? `-${n[3]}` : ''}`;
    }
    return maskedNumber;
  }
  return value;
};

export function getOriginalNo(phone: string | undefined) {
  try {
    if (phone) {
      const number = phoneUtil.parseAndKeepRawInput(phone, 'US');
      return number.getNationalNumber();
    }
    return phone;
  } catch {
    return phone;
  }
}

export function getImageExtension(uri: string) {
  const uriArr = uri?.split('?')?.[0];

  // eslint-disable-next-line no-unsafe-optional-chaining
  const filename = uriArr?.substring(uriArr?.lastIndexOf('/') + 1);
  const uriArr2 = filename?.split('.')?.[1];
  return {uriArr2, filename};
}

export const randomName = (length: number) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export async function removeFileFromCache(uri: string) {
  await ReactNativeBlobUtil.fs.unlink(uri.split('file://')[1]);
}

type SaveCroppedImageParams = {
  name: string;
  type: string;
  uri: string;
};

export async function saveImageOnCache(params: SaveCroppedImageParams) {
  try {
    const {name, type, uri: base64} = params;
    const imageData = base64.split('base64,')[1];
    const filePath = ReactNativeBlobUtil.fs.dirs.CacheDir;
    const dest = `${filePath}/${name}`;
    await ReactNativeBlobUtil.fs.writeFile(dest, imageData, 'base64');
    return {name, type, uri: `file://${dest}`};
  } catch (error) {
    return Promise.reject(error);
  }
}

async function saveBase64OnCache(data: string) {
  try {
    const croppedFileType = data.split(';')[0].split('/')[1];
    const croppedFileName = `${randomName(8)}.${croppedFileType}`;
    const type = `image/${croppedFileType}`;
    const croppedFile = {name: croppedFileName, type, uri: data};
    return await saveImageOnCache(croppedFile);
  } catch (error) {
    return Promise.reject(error);
  }
}

function omitFields(object: {[x: string]: any}, fields: string[]) {
  let clone: {[x: string]: any} = {};
  if (object && typeof object === 'object' && !Array.isArray(object)) {
    clone = {};
    Object.keys(object).forEach(key => {
      if (!(fields.indexOf(key) >= 0 || key.endsWith('Text'))) {
        clone[key] = object[key];
      }
    });
  }
  return clone;
}

function isEmailValid(email: string) {
  const isValid = String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
  return isValid;
}

const toggleElement = <T>(array: Array<T>, value: T) => {
  const newArray = array.filter(x => x !== value);
  if (newArray.length === array.length) return array.concat(value);
  return newArray;
};

export function sortArray(
  x: string | number | boolean,
  y: string | number | boolean,
) {
  const pre = ['string', 'number', 'bool'];
  if (typeof x !== typeof y) {
    return pre.indexOf(typeof y) - pre.indexOf(typeof x);
  }

  if (x === y) {
    return 0;
  }
  return x > y ? 1 : -1;
}

const getBusinessStepValue = (checkingFor: BusinessSteps | undefined) => {
  switch (checkingFor) {
    case 'business_info':
      return 1;
    case 'business_images':
      return 2;
    case 'payment':
    case 'payment_failed':
      return 3;
    case 'payment_processing':
    case 'payment_successful':
    case 'completed':
      return 4;
    default:
      return 1;
  }
};

const getMonthName = (monthNumber: number) => {
  return monthNames[monthNumber];
};

const timeDiffCalc = (date: any) => {
  let dateFuture = date;
  if (dateFuture === undefined) return '';
  const dateNow: any = new Date();
  dateFuture = new Date(dateFuture);

  let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;
  // calculate days
  const days = Math.floor(diffInMilliSeconds / 86400);
  diffInMilliSeconds -= days * 86400;

  // calculate hours
  const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
  diffInMilliSeconds -= hours * 3600;

  // calculate minutes
  const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
  diffInMilliSeconds -= minutes * 60;

  let difference = '';
  if (days > 0 && days <= 7) {
    difference = days === 1 ? `${days} day ago` : `${days} days ago`;
    return difference;
  }
  if (days <= 0 && (hours > 0 || minutes >= 0)) {
    if (hours > 0) {
      difference = hours === 1 ? `${hours} hour ago` : `${hours} hours ago`;
      return difference;
    }
    if (minutes >= 0) {
      difference =
        minutes === 0 || minutes === 1 ? `Just now` : `${minutes} minutes ago`;
      return difference;
    }
  } else {
    // return the post created date
    const getCurrentYear =
      dateFuture.getFullYear() !== dateNow.getFullYear()
        ? dateFuture.getFullYear()
        : '';
    difference = `${getMonthName(
      dateFuture.getMonth(),
    )}  ${dateFuture.getDate()} ${
      getCurrentYear !== '' ? `, ${getCurrentYear}` : ''
    }`;
    return difference;
  }
  return difference;
};

export const openInAppBrowser = async (url: string) => {
  try {
    const nUrl =
      url.includes('http://') || url.includes('https://')
        ? url
        : `https://${url}`;
    if (await InAppBrowser.isAvailable()) {
      await InAppBrowser.open(nUrl);
      await InAppBrowser.close();
    } else {
      Linking.openURL(nUrl);
    }
  } catch (error) {
    // Error.
  }
};

const toFixed = (num: any, fixed: number) => {
  const re = new RegExp(`^-?\\d+(?:\\.\\d{0,${fixed || -1}})?`);
  return num.toString().match(re)[0];
};

export const formatCount = (n: number) => {
  if (n < 1e3) return n;
  if (n >= 1e3 && n < 1e6) {
    return `${+toFixed(n / 1e3, 1)}K`;
  }
  if (n >= 1e6 && n < 1e9) {
    return `${+toFixed(n / 1e6, 1)}M`;
  }
  if (n >= 1e9 && n < 1e12) {
    return `${+toFixed(n / 1e9, 1)}B`;
  }
  return null;
};

const closeKeyboard = () => Keyboard.dismiss();

function insertAt(text: string, index: number, string: string) {
  return text.slice(0, index) + string + text.slice(index);
}

function calculateHeightWidth(
  imageHeight: number,
  imageWidth: number,
  percentage = 1,
) {
  const ratio = Math.min(
    SCREEN_HEIGHT / imageHeight,
    SCREEN_WIDTH / imageWidth,
  );

  const rWidth = imageWidth * ratio * percentage;
  const rHeight = imageHeight * ratio * percentage;

  return {
    height: !Number.isNaN(rHeight) ? rHeight : SCREEN_WIDTH * 0.7,
    width: !Number.isNaN(rWidth) ? rWidth : SCREEN_WIDTH,
  };
}

function getHTML(str: string) {
  const isHTML = /<\/?[a-z][\s\S]*>/i.test(str);
  return isHTML ? str : `<p>${str}</p>`;
}

const getNewsProviderLogo = (type: string, name: string) => {
  if (type === 'podcasts') {
    return name;
  }
  const providerImageName = name
    .toLowerCase()
    .replaceAll('.', '')
    .replaceAll(' ', '_');
  return ProviderThumbs[providerImageName as ThumbImagesType] ?? name;
};

export const getNewsProviderBackground = (name: string) => {
  const providerImageName = name.toLowerCase().replaceAll(' ', '_');
  return ProviderBG[providerImageName as BGImagesType] ?? undefined;
};

const getResourceImage = (name: string) => {
  const key = name.toLowerCase().replaceAll('.', '').replaceAll(' ', '_');
  return Images[key as ImagesType] ?? null;
};

function isValidURL(url?: string) {
  if (url) {
    return url.includes('http://') || url.includes('https://');
  }
  return false;
}

function isJsonString(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

const setCurrentPosition = async (key: string, data: any) => {
  await AsyncStorage.setItem(key, JSON.stringify(data));
};

const removeItemValue = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (exception) {
    return false;
  }
};

const getCurrentPosition = async (key: string) => {
  const response = await AsyncStorage.getItem(key);
  return response || 0;
};

export {
  saveBase64OnCache,
  omitFields,
  isEmailValid,
  toggleElement,
  getBusinessStepValue,
  timeDiffCalc,
  closeKeyboard,
  insertAt,
  calculateHeightWidth,
  getHTML,
  getNewsProviderLogo,
  getResourceImage,
  isValidURL,
  isJsonString,
  setCurrentPosition,
  getCurrentPosition,
  removeItemValue,
};
