import { getOrderStage } from '@/api/orders/status';
import { Order, WithId } from '@appjusto/types';
import { router } from 'expo-router';
import { useEffect } from 'react';

type SourceScreen = 'checkout' | 'confirming' | 'index' | 'ongoing';

export const useRouterAccordingOrderStatus = (
  order: WithId<Order> | undefined | null,
  source: SourceScreen
) => {
  const orderId = order?.id;
  const status = order?.status;
  const type = order?.type;
  // side effects
  useEffect(() => {
    console.log(
      'useRouterAccordingOrderStatus',
      orderId,
      status,
      source,
      'ongoing:',
      status && type ? getOrderStage(status, type) : ''
    );
    if (!orderId) return;
    if (!status) return;
    if (!type) return;
    const stage = getOrderStage(status, type);
    if (stage === 'confirming') {
      if (source !== 'confirming') {
        console.log({ pathname: '/(logged)/(tabs)/(orders)/[id]/confirming' });
        router.replace({
          pathname: '/(logged)/(tabs)/(orders)/[id]/confirming',
          params: { id: orderId },
        });
        // router.replace({
        //   pathname: '/(logged)/confirming/[orderId]/',
        //   params: { orderId: options.orderId },
        // });
      }
    } else if (stage === 'ongoing') {
      if (source !== 'ongoing') {
        console.log({ pathname: '/(logged)/(tabs)/(orders)/[id]/ongoing' });
        router.replace({
          pathname: '/(logged)/(tabs)/(orders)/[id]/ongoing',
          params: { id: orderId },
        });
      }
    } else if (stage === 'completed') {
      router.replace({
        pathname: '/(logged)/(tabs)/(orders)/[id]/delivered',
        params: { id: orderId },
      });
    } else if (stage === 'expired') {
      // TODO
    }
  }, [orderId, status, type, source]);
};
