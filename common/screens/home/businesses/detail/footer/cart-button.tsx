import { useContextOrderQuote } from '@/api/orders/context/order-context';
import { getOrderTotalCost } from '@/api/orders/revenue/getOrderRevenue';
import { getOrderItemsTotal } from '@/api/orders/total/getOrderItemsTotal';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { HRShadow } from '@/common/components/views/hr-shadow';
import { formatCurrency } from '@/common/formatters/currency';
import paddings from '@/common/styles/paddings';
import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  variant: 'business' | 'checkout' | 'place-order';
  disabled: boolean;
  onPress: () => void;
}

export const CartButton = ({ variant, disabled, onPress, style, ...props }: Props) => {
  // context
  const quote = useContextOrderQuote();
  // UI
  if (!quote) return null;
  const totalLabel = quote.fare?.courier?.value
    ? variant === 'business'
      ? 'sem a entrega'
      : 'com a entrega'
    : '';
  const total = variant === 'business' ? getOrderItemsTotal(quote) : getOrderTotalCost(quote);
  const totalItems = quote.items?.length ? quote.items.length : 0;
  return (
    <View style={[{}, style]} {...props}>
      <HRShadow />
      <View style={{ padding: paddings.lg, flexDirection: 'row', justifyContent: 'space-between' }}>
        <View>
          <DefaultText size="xs" color="neutral700">
            {`Total ${totalLabel}`}
          </DefaultText>
          <View style={{ marginTop: paddings.xs, flexDirection: 'row', alignItems: 'center' }}>
            <DefaultText size="md">{formatCurrency(total)}</DefaultText>
            <DefaultText
              style={{ marginLeft: paddings.xs }}
              size="xs"
              color="neutral700"
            >{` / ${totalItems} ite${totalItems > 1 ? 'ns' : 'm'}`}</DefaultText>
          </View>
        </View>
        <DefaultButton
          title={
            variant === 'business'
              ? 'Ver sacola'
              : variant === 'place-order'
              ? 'Confirmar pedido'
              : 'Continuar'
          }
          size="lg"
          disabled={disabled}
          onPress={onPress}
        />
      </View>
    </View>
  );
};
