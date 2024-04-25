import { useContextApi } from '@/api/ApiContext';
import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextOrder } from '@/api/orders/context/order-context';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { useShowToast } from '@/common/components/views/toast/ToastContext';
import { TipControl } from '@/common/screens/orders/delivered/tip/tip-control';
import { OrderReviewView } from '@/common/screens/orders/review/order-review-view';
import { ScreenTitle } from '@/common/screens/title/screen-title';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { OrderReview, ReviewType } from '@appjusto/types';
import crashlytics from '@react-native-firebase/crashlytics';
import { router } from 'expo-router';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

export default function OrderDeliveredScreen() {
  // context
  const api = useContextApi();
  const showToast = useShowToast();
  const order = useContextOrder();
  const orderId = order?.id;
  // state
  const [tip, setTip] = useState(0);
  const [courierReview, setCourierReview] = useState<ReviewType>();
  const [businessReview, setBusinessReview] = useState<ReviewType>();
  const [platformReview, setPlatformReview] = useState<ReviewType>();
  const [nps, setNPS] = useState<number>();
  const [loading, setLoading] = useState(false);
  // tracking
  useTrackScreenView('Pedido entregue', { orderId });
  // side effects
  useEffect(() => {
    if (!order?.tip?.value) return;
    if (order.tip.value !== tip) setTip(order.tip.value);
  }, [order, tip]);
  // handlers
  // update review
  const setReviewHandler = () => {
    if (!order) return;
    if (!orderId) return;
    let review: Partial<OrderReview> = { npsVersion: '10' };
    if (courierReview) {
      review = { ...review, courier: { id: order.courier?.id ?? null, rating: courierReview } };
    }
    if (businessReview && order.business?.id) {
      review = { ...review, business: { id: order.business.id, rating: businessReview } };
    }
    if (platformReview) {
      review = { ...review, platform: { rating: platformReview } };
    }
    if (nps) {
      review = { ...review, nps };
    }
    console.log('to update:', review);

    if (isEmpty(review)) {
      router.replace('/(logged)/(tabs)/(home)/');
    } else {
      setLoading(true);
      api
        .orders()
        .setOrderReview(orderId, review)
        .then(() => {
          setLoading(false);
          router.replace('/(logged)/(tabs)/(home)/');
        })
        .catch((error: unknown) => {
          setLoading(false);
          console.error(error);
          if (error instanceof Error) crashlytics().recordError(error);
          showToast('Não foi possível enviar a avaliação.', 'error');
          router.back();
        });
    }
  };

  // UI
  if (!order) return <ScreenTitle title="Pedido entregue" loading />;
  const { code } = order;
  return (
    <DefaultScrollView style={{ ...screens.default, backgroundColor: colors.neutral50 }}>
      <ScreenTitle title={`Pedido #${code}`} />

      <View
        style={{
          flex: 1,
          padding: paddings.lg,
        }}
      >
        <TipControl
          style={{ marginBottom: paddings.lg }}
          order={order}
          tip={tip}
          onChange={setTip}
        />
        <OrderReviewView
          courierReview={courierReview}
          businessReview={businessReview}
          platformReview={platformReview}
          nps={nps}
          disabled={!order}
          orderId={orderId}
          setCourierReview={order.courier?.id ? setCourierReview : undefined}
          setBusinessReview={order.business?.id ? setBusinessReview : undefined}
          setPlatformReview={setPlatformReview}
          setNPS={setNPS}
        />
        <View style={{ flex: 1 }} />
        <DefaultButton
          // style={{ marginVertical: paddings.sm }}
          title="Finalizar"
          disabled={!order || loading}
          onPress={setReviewHandler}
        />
      </View>
    </DefaultScrollView>
  );
}
