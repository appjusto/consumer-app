import { getOrderDiscounts } from '@/api/orders/total/getOrderDiscounts';
import { getOrderItemsTotal } from '@/api/orders/total/getOrderItemsTotal';
import { getOrderTotalCost } from '@/api/orders/total/getOrderTotalCost';
import { isOrderEmpty } from '@/api/orders/total/isOrderEmpty';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { HRShadow } from '@/common/components/views/hr-shadow';
import { formatCurrency } from '@/common/formatters/currency';
import paddings from '@/common/styles/paddings';
import { Order } from '@appjusto/types';
import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  order: Order | undefined | null;
  variant: 'total-products' | 'total-order' | 'none';
  disabled: boolean;
  onPress: () => void;
}

export const CartButton = ({ order, variant, disabled, onPress, style, ...props }: Props) => {
  // context
  // UI
  if (!order) return null;
  const total =
    variant === 'total-products'
      ? getOrderItemsTotal(order, true) - getOrderDiscounts(order)
      : variant === 'total-order'
      ? getOrderTotalCost(order)
      : 0;
  const totalLabel =
    variant === 'total-products'
      ? 'sem a entrega'
      : variant === 'total-order'
      ? 'com a entrega'
      : '';
  const totalItems = order.items?.length ? order.items.length : 0;
  const itemsLabel = totalItems ? ` / ${totalItems} ite${totalItems > 1 ? 'ns' : 'm'}` : null;
  if (isOrderEmpty(order)) return null;
  return (
    <View style={[{}, style]} {...props}>
      <HRShadow />
      <View style={{ padding: paddings.lg, flexDirection: 'row', justifyContent: 'space-between' }}>
        {total > 0 ? (
          <View>
            <DefaultText size="xs" color="neutral700">
              {`Total ${totalLabel}`}
            </DefaultText>
            <View style={{ marginTop: paddings.xs, flexDirection: 'row', alignItems: 'center' }}>
              <DefaultText size="md">{formatCurrency(total)}</DefaultText>
              {itemsLabel ? (
                <DefaultText style={{ marginLeft: paddings.xs }} size="xs" color="neutral700">
                  {itemsLabel}
                </DefaultText>
              ) : null}
            </View>
          </View>
        ) : (
          <View />
        )}
        <DefaultButton
          title={variant === 'total-products' ? 'Ver sacola' : 'Continuar'}
          size="lg"
          disabled={disabled}
          onPress={onPress}
        />
      </View>
    </View>
  );
};
