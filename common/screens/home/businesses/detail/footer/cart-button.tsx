import { getOrderItemsTotal } from '@/api/orders/total/getOrderItemsTotal';
import { getOrderTotalCost } from '@/api/orders/total/getOrderTotalCost';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { HRShadow } from '@/common/components/views/hr-shadow';
import { formatCurrency } from '@/common/formatters/currency';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { Order } from '@appjusto/types';
import { ActivityIndicator, View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  order: Order | undefined | null;
  variant: 'business' | 'checkout' | 'place-order';
  disabled: boolean;
  onPress: () => void;
}

export const CartButton = ({ order, variant, disabled, onPress, style, ...props }: Props) => {
  // context
  // UI
  if (!order) return null;
  const total = variant === 'business' ? getOrderItemsTotal(order) : getOrderTotalCost(order);
  const totalLabel = order.fare?.courier?.value
    ? variant === 'business'
      ? 'sem a entrega'
      : 'com a entrega'
    : '';
  const totalItems = order.items?.length ? order.items.length : 0;
  const itemsLabel = totalItems ? ` / ${totalItems} ite${totalItems > 1 ? 'ns' : 'm'}` : null;
  if (variant === 'business' && !total) return null;
  return (
    <View style={[{}, style]} {...props}>
      <HRShadow />
      <View style={{ padding: paddings.lg, flexDirection: 'row', justifyContent: 'space-between' }}>
        {total ? (
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
          <ActivityIndicator size={12} color={colors.black} />
        )}
        <DefaultButton
          title={
            variant === 'business'
              ? 'Ver sacola'
              : variant === 'place-order'
              ? 'Confirmar pedido'
              : 'Continuar'
          }
          size="lg"
          disabled={disabled || !total}
          onPress={onPress}
        />
      </View>
    </View>
  );
};
