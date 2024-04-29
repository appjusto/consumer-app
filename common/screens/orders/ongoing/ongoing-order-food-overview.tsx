import { PaymentsHandledByBusiness } from '@/api/orders/payment';
import { useObserveOrderCard } from '@/api/orders/payment/useObserveOrderCard';
import { getOrderTotalCost } from '@/api/orders/total/getOrderTotalCost';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { HR } from '@/common/components/views/HR';
import { formatCurrency } from '@/common/formatters/currency';
import borders from '@/common/styles/borders';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { Order, WithId } from '@appjusto/types';
import { router } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { Pressable, View, ViewProps } from 'react-native';
import { OrderSelectedPayment } from '../checkout/confirmation/order-selected-payment';

interface Props extends ViewProps {
  order: WithId<Order>;
}

export const OngoingOrderFoodOverview = ({ order, style, ...props }: Props) => {
  const { business, code, paymentMethod } = order;
  // state
  const paidWithCard =
    paymentMethod && paymentMethod !== 'pix' && !PaymentsHandledByBusiness.includes(paymentMethod);
  const card = useObserveOrderCard(business?.id && paidWithCard ? order.id : undefined);
  // handlers
  const detailHandler = () => {
    router.navigate({
      pathname: '/(logged)/(tabs)/order/[orderId]/detail',
      params: { orderId: order.id },
    });
  };
  // UI
  if (!business?.id) return null;
  return (
    <View
      style={[
        {
          paddingHorizontal: paddings.lg,
          paddingVertical: paddings.lgg,
          backgroundColor: colors.white,
          ...borders.light,
        },
        style,
      ]}
      {...props}
    >
      {/* header */}
      <Pressable onPress={detailHandler}>
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <View>
            <DefaultText color="neutral700">Detalhes do pedido</DefaultText>
            <DefaultText
              style={{ marginTop: paddings.sm }}
              size="md"
              color="black"
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {business.name}
            </DefaultText>
            <DefaultText color="neutral800">{`Pedido #${code}`}</DefaultText>
          </View>
          <ChevronRight color={colors.neutral800} size={20} />
        </View>
      </Pressable>
      {/* payment */}
      <HR style={{ marginVertical: paddings.lg }} />
      <OrderSelectedPayment variant="ongoing" paymentMethod={paymentMethod} card={card} />
      <HR style={{ marginVertical: paddings.lg }} />
      {/* total */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <DefaultText size="md" color="black">
          Total
        </DefaultText>
        <DefaultText size="md" color="black">
          {formatCurrency(getOrderTotalCost(order))}
        </DefaultText>
      </View>
    </View>
  );
};
