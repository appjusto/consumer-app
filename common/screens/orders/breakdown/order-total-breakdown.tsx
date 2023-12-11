import { getOrderItemsTotal } from '@/api/orders/total/getOrderItemsTotal';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { formatCurrency } from '@/common/formatters/currency';
import { ColorName } from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { Order } from '@appjusto/types';
import { View, ViewProps } from 'react-native';

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
  // helpers
  const platformFee = order.fare?.platform?.value;
  const itemsTotal = getOrderItemsTotal(order);
  const deliveryNetValue = order.fare?.courier?.netValue ?? 0;
  const deliveryHighDemandFee = order.fare?.courier?.locationFee ?? 0;
  const insuranceFee = order.fare?.courier?.insurance ?? 0;
  const fees = deliveryHighDemandFee + insuranceFee;
  // UI
  return (
    <View style={[{ padding: paddings.lg, borderWidth: 0 }, style]} {...props}>
      {/* p2p fee */}
      {platformFee ? <Item title="Taxa de serviço" value={platformFee} /> : null}
      {/* food items */}
      {itemsTotal ? <Item title="Itens do pedido" value={itemsTotal} /> : null}
      {/* food items */}
      {deliveryNetValue ? <Item title="Entrega" value={deliveryNetValue} /> : null}
      {fees ? <Item title="Taxas + Seguro Iza" value={fees} /> : null}
    </View>
  );
};
