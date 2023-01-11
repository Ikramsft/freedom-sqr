/**
 * @format
 */
import React from 'react';
import {useQueryClient} from 'react-query';

import client from 'api';

import {config} from '../../config';
import {IRequestMeta} from '../../constants';
import {QueryKeys} from '../../utils/QueryKeys';
import {showSnackbar} from '../../utils/SnackBar';
import {ICreditCard} from './useCardForm';

export interface ICardResponse extends IRequestMeta {
  data: ICreditCard;
}

async function deleteCardApi(id: string): Promise<ICardResponse> {
  try {
    const url = `${config.PAYMENT_API_URL}/creditCards/${id}`;
    const res: ICardResponse = await client.delete(url);
    return res;
  } catch (error: any) {
    return error;
  }
}

async function addCardApi(data: Partial<ICreditCard>): Promise<ICardResponse> {
  try {
    const url = `${config.PAYMENT_API_URL}/creditCards`;
    const res: ICardResponse = await client.post(url, data);
    return res;
  } catch (error: any) {
    return error;
  }
}

async function updateCardApi(
  data: Partial<ICreditCard>,
  id: string,
): Promise<ICardResponse> {
  try {
    const url = `${config.PAYMENT_API_URL}/creditCards/${id}`;
    const res: ICardResponse = await client.put(url, data);
    return res;
  } catch (error: any) {
    return error;
  }
}

const useCardOperations = () => {
  const queryClient = useQueryClient();

  const [adding, setAdding] = React.useState(false);
  const [updating, setUpdating] = React.useState(false);
  const [removing, setRemoving] = React.useState({
    removing: false,
    removingId: '',
  });

  const addCard = async (data: Partial<ICreditCard>) => {
    setAdding(true);
    const response: ICardResponse = await addCardApi(data);
    if (response.status === 200) {
      showSnackbar({message: response.message, type: 'success'});
      queryClient.invalidateQueries(QueryKeys.cardList);
      setAdding(false);
    } else {
      setAdding(false);
      const message = response?.message || 'Something went wrong!';
      showSnackbar({message, type: 'error'});
      throw Error(message);
    }
  };

  const updateCard = async (data: Partial<ICreditCard>, id: string) => {
    setUpdating(true);
    const response: ICardResponse = await updateCardApi(data, id);
    if (response.status === 200) {
      showSnackbar({message: response.message, type: 'success'});
      queryClient.invalidateQueries(QueryKeys.cardList);
      setUpdating(false);
    } else {
      setUpdating(false);
      const message = response?.message || 'Something went wrong!';
      showSnackbar({message, type: 'error'});
      throw Error(message);
    }
  };

  const removeCard = async (id: string) => {
    setRemoving({removing: true, removingId: id});
    const response: ICardResponse = await deleteCardApi(id);
    if (response.status === 200) {
      showSnackbar({message: response.message, type: 'success'});
      queryClient.invalidateQueries(QueryKeys.cardList);
      setRemoving({removing: false, removingId: ''});
    } else {
      setRemoving({removing: false, removingId: ''});
      const message = response?.message || 'Something went wrong!';
      showSnackbar({message, type: 'error'});
      throw Error(message);
    }
  };

  return {adding, updating, removing, addCard, updateCard, removeCard};
};

export {useCardOperations};
