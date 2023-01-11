/**
 * @format
 */

import {useCallback} from 'react';
import valid from 'card-validator';

const useCardHelper = () => {
  const FALLBACK_CARD = {gaps: [4, 8, 12], lengths: [16], code: {size: 3}};

  const removeLeadingSpaces = useCallback((value: string) => {
    return value !== ' ' ? value.replace(/\s{2,}/g, ' ') : value.trim();
  }, []);

  const removeNonNumber = useCallback(
    (string = '') => string.replace(/[^\d]/g, ''),
    [],
  );

  const limitLength = useCallback(
    (string = '', maxLength: number) => string.substr(0, maxLength),
    [],
  );

  const addGaps = useCallback((string = '', gaps: number[]) => {
    const offsets = [0].concat(gaps).concat([string.length]);
    return offsets
      .map((end, index) => {
        if (index === 0) {
          return '';
        }
        const start = offsets[index - 1];
        return string.substr(start, end - start);
      })
      .filter(part => part !== '')
      .join(' ');
  }, []);

  // const formatCardHolderName = useCallback(
  //   (name: string) => removeLeadingSpaces(name),
  //   [removeLeadingSpaces],
  // );

  const formatCardNumber = useCallback(
    (number: string, card: typeof FALLBACK_CARD) => {
      const numberSanitized = removeNonNumber(number);
      const maxLength = card.lengths[card.lengths.length - 1];
      const lengthSanitized = limitLength(numberSanitized, maxLength);
      const formatted = addGaps(lengthSanitized, card.gaps);
      return formatted;
    },
    [addGaps, limitLength, removeNonNumber],
  );

  const formatExpiry = useCallback(
    (expiry: string) => {
      const nonNumber = removeNonNumber(expiry);
      const sanitized = limitLength(nonNumber, 4);
      if (sanitized.match(/^[2-9]$/)) {
        const between2And9 = `0${sanitized}`;
        return between2And9;
      }
      if (sanitized.length > 2) {
        const formated = `${sanitized.substr(0, 2)}/${sanitized.substr(
          2,
          sanitized.length,
        )}`;
        return formated;
      }
      return sanitized;
    },
    [limitLength, removeNonNumber],
  );

  const formatCVC = useCallback(
    (cvc: string, card: typeof FALLBACK_CARD) =>
      limitLength(removeNonNumber(cvc), card.code.size),
    [limitLength, removeNonNumber],
  );

  const onFieldChange =
    (change: (...event: any[]) => void) => (text: string) => {
      change(removeLeadingSpaces(text));
    };

  const onNumericFieldChange =
    (change: (...event: any[]) => void) => (text: string) => {
      change(removeNonNumber(removeLeadingSpaces(text)));
    };

  return {
    FALLBACK_CARD,
    removeLeadingSpaces,
    formatCardNumber,
    formatCVC,
    formatExpiry,
    valid,
    onFieldChange,
    onNumericFieldChange,
  };
};

export {useCardHelper};
