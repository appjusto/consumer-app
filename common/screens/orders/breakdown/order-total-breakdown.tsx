import { getOrderItemsTotal } from '@/api/orders/total/getOrderItemsTotal';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { Loading } from '@/common/components/views/Loading';
import { formatCurrency } from '@/common/formatters/currency';
import { ColorName } from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { Order } from '@appjusto/types';
import { View, ViewProps } from 'react-native';
import { OrderTotalBreakdownFees } from './order-total-breakdown-fees';

interface ItemProps extends ViewProps {
  title: string;
  value: number;
  color?: ColorName;
}

const Item = ({ title, value, color = 'neutral800', style, ...props }: ItemProps) => (
  <View
    style={[
      { flexDirection: 'row', justifyContent: 'space-between', marginTop: paddings.xs },
      style,
    ]}
    {...props}
  >
    <DefaultText color={color}>{title}</DefaultText>
    <DefaultText color={color}>{formatCurrency(value)}</DefaultText>
  </View>
);

interface Props extends ViewProps {
  order: Order;
}

export const OrderTotalBreakdown = ({ order, style, ...props }: Props) => {
  if (!order.fare) return <Loading size="small" color="neutral800" />;
  // helpers
  const { fare } = order;
  const platformFee = fare.platform?.value;
  const itemsTotal = getOrderItemsTotal(order);
  const deliveryNetValue = fare.courier?.netValue ?? 0;
  const deliveryFees = fare.courier?.processing?.value ?? 0;
  const deliveryHighDemandFee = fare.courier?.locationFee ?? 0;
  const insuranceFee = fare.courier?.insurance ?? 0;
  const fees = deliveryFees + insuranceFee;
  const credits = fare.credits ?? 0;
  const total = fare.total - credits;
  // UI
  return (
    <View style={[{ borderWidth: 0 }, style]} {...props}>
      {/* p2p fee */}
      {platformFee ? <Item title="Serviço" value={platformFee} /> : null}
      {/* food items */}
      {itemsTotal ? <Item title="Itens do pedido" value={itemsTotal} /> : null}
      {/* food items */}
      {deliveryNetValue ? <Item title="Entrega" value={deliveryNetValue} /> : null}
      {deliveryHighDemandFee ? (
        <Item title="Taxa de alta demanda" value={deliveryHighDemandFee} />
      ) : null}
      {fees ? <Item title={`Taxas${insuranceFee ? ' + Seguro Iza' : ''}`} value={fees} /> : null}
      {credits ? <Item title="Créditos" value={credits} color="primary900" /> : null}
      {total ? <Item title="Total" value={total} color="black" /> : null}
      <OrderTotalBreakdownFees order={order} />
    </View>
  );
};
