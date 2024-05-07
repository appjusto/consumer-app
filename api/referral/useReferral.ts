import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useContextApi } from '../ApiContext';
import { useContextOrder } from '../orders/context/order-context';

const KEY = 'referral';

const retrieve = async () => {
  let value = null;
  try {
    value = await AsyncStorage.getItem(KEY);
  } catch (e: unknown) {
    console.error(e);
  }
  return value;
};

const update = async (value: string) => {
  try {
    await AsyncStorage.setItem(KEY, value);
    return value;
  } catch (e: unknown) {
    console.error(e);
  }
  return null;
};

const remove = async () => {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch (e: unknown) {
    console.error(e);
  }
};

export const useReferral = () => {
  // params
  const params = useGlobalSearchParams<{ referral: string }>();
  // context
  const api = useContextApi();
  const order = useContextOrder();
  const orderId = order?.id;
  // state
  const [referral, setReferral] = useState<string | null>();
  // side effects;
  // initial retrieval
  useEffect(() => {
    retrieve().then(setReferral);
  }, []);
  // check params
  useEffect(() => {
    // skip undefined to let initial retrieval runs first
    if (referral === undefined) return;
    if (referral === null && params.referral) {
      update(params.referral).then(setReferral);
    }
  }, [params, referral]);
  // apply coupon to order
  // side effects
  useEffect(() => {
    if (!orderId) return;
    if (!referral) return;
    api
      .orders()
      .updateCoupon(orderId, referral.toUpperCase())
      .then(() => console.log('Aplicado com sucesso'))
      .catch(() => {
        console.log('Não foi possível aplicar. Removendo referral');
        return remove();
      });
  }, [api, orderId, referral]);
};
