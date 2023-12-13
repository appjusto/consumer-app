import { useContextBusinessQuote } from '@/api/business/context/business-context';
import { getOrderTotalCost } from '@/api/orders/revenue/getOrderRevenue';
import { getOrderItemsTotal } from '@/api/orders/total/getOrderItemsTotal';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { HR } from '@/common/components/views/HR';
import { formatCurrency } from '@/common/formatters/currency';
import paddings from '@/common/styles/paddings';
import { useLocalSearchParams } from 'expo-router';
import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  variant: 'business' | 'checkout';
  onPress: () => void;
}

export const CartButton = ({ variant, onPress, style, ...props }: Props) => {
  // params
  const params = useLocalSearchParams<{ id: string }>();
  const businessId = params.id;
  // context
  const quote = useContextBusinessQuote();
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
      <HR
        style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.22,
          shadowRadius: 2.22,
          elevation: 3,
        }}
      />
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
          title={variant === 'business' ? 'Ver sacola' : 'Continuar'}
          size="lg"
          disabled={variant === 'checkout' && !quote.fare}
          onPress={onPress}
        />
      </View>
    </View>
  );
};
