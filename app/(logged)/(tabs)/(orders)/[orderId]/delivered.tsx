import { useContextApi } from '@/api/ApiContext';
import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextOrder } from '@/api/orders/context/order-context';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { Loading } from '@/common/components/views/Loading';
import DefaultCard from '@/common/components/views/cards/DefaultCard';
import { DefaultCardIcon } from '@/common/components/views/cards/icon';
import { useShowToast } from '@/common/components/views/toast/ToastContext';
import { openWhatsAppSupportURL } from '@/common/constants/openWhatsAppSupportURL';
import { TipControl } from '@/common/screens/orders/delivered/tip/tip-control';
import { OrderReviewView } from '@/common/screens/orders/review/order-review-view';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { OrderReview, ReviewType } from '@appjusto/types';
import crashlytics from '@react-native-firebase/crashlytics';
import { Stack, router } from 'expo-router';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';

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
  const supportHandler = () => () => openWhatsAppSupportURL('Pedido entregue');
  const complaintHandler = () => router.replace('/complaint/');
  // UI
  if (!order) return <Loading title="Pedido entregue!" />;
  return (
    <DefaultScrollView style={{ ...screens.default, backgroundColor: colors.neutral50 }}>
      <Stack.Screen options={{ title: `Pedido #${order.code}` }} />

      <View
        style={{
          flex: 1,
          padding: paddings.lg,
        }}
      >
        <TipControl order={order} tip={tip} onChange={setTip} />
        <OrderReviewView
          style={{ marginTop: paddings.lg }}
          courierReview={courierReview}
          businessReview={businessReview}
          platformReview={platformReview}
          nps={nps}
          disabled={!order}
          orderId={orderId}
          setCourierReview={setCourierReview}
          setBusinessReview={order.business?.id ? setBusinessReview : undefined}
          setPlatformReview={setPlatformReview}
          setNPS={setNPS}
        />
        <View
          style={{
            backgroundColor: colors.white,
            marginTop: paddings.lg,
            padding: paddings.lg,
            borderRadius: 8,
            borderColor: colors.neutral100,
            borderWidth: 1,
          }}
        >
          <View style={{ marginTop: paddings.lg }}>
            <DefaultText size="lg">Teve algum problema com a corrida?</DefaultText>
            <DefaultText style={{ marginTop: paddings.xs }}>
              Fale com um de nossos atendentes ou realize uma denúncia
            </DefaultText>
            <Pressable onPress={supportHandler}>
              <DefaultCard
                style={{ marginTop: paddings.lg }}
                icon={<DefaultCardIcon iconName="chat" />}
                title="Suporte appjusto"
                subtitle="Fale com a gente através do nosso WhatsApp"
              />
            </Pressable>
            <Pressable onPress={complaintHandler}>
              <DefaultCard
                style={{ marginTop: paddings.sm }}
                icon={<DefaultCardIcon iconName="alert" variant="warning" />}
                title="Denunciar"
                subtitle="Realize uma denúncia através do appjusto"
              />
            </Pressable>
          </View>
        </View>
        <DefaultButton
          style={{ marginVertical: paddings.xl }}
          title="Finalizar"
          disabled={!order || loading}
          onPress={setReviewHandler}
        />
      </View>
    </DefaultScrollView>
  );
}
