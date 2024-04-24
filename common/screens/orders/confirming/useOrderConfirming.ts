import { useContextOrder } from '@/api/orders/context/order-context';
import { isOrderBeforeConfirmed } from '@/api/orders/status';
import { useIsFocused } from '@react-navigation/native';
import { router, useNavigation, useSegments } from 'expo-router';
import { useEffect } from 'react';

export const useOrderConfirming = () => {
  // context
  const order = useContextOrder();
  const orderId = order?.id;
  const { status, type } = order ?? {};
  const navigation = useNavigation();
  const segments = useSegments();
  const ordersTab = segments.some((value) => value === 'pedido');
  const isFocused = useIsFocused();
  // side effects
  useEffect(() => {
    if (!orderId) return;
    if (!status) return;
    if (!isFocused) return;
    if (isOrderBeforeConfirmed(status)) return;
    if (status === 'confirmed' && type === 'food') return;
    if (status === 'declined') {
      if (!ordersTab) {
        router.back();
        return;
      }
    }
    // @ts-ignore
    navigation.navigate('pedido', {
      screen: '[orderId]/ongoing',
      params: { orderId },
      initial: false,
    });
  }, [orderId, status, isFocused, type, ordersTab, navigation]);
};
