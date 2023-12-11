import { useContextBusinessQuote } from '@/api/business/context/business-context';
import { getOrderTotal } from '@/api/orders/total/getOrderTotal';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { HR } from '@/common/components/views/HR';
import { formatCurrency } from '@/common/formatters/currency';
import paddings from '@/common/styles/paddings';
import { router, useLocalSearchParams } from 'expo-router';
import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {}

export const BusinessFooter = ({ style, ...props }: Props) => {
  // params
  const params = useLocalSearchParams<{ id: string }>();
  const businessId = params.id;
  // context
  const quote = useContextBusinessQuote();
  // UI
  if (!quote) return null;
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
            Total sem a entrega
          </DefaultText>
          <View style={{ marginTop: paddings.xs, flexDirection: 'row', alignItems: 'center' }}>
            <DefaultText size="md">{formatCurrency(getOrderTotal(quote))}</DefaultText>
            <DefaultText
              style={{ marginLeft: paddings.xs }}
              size="xs"
              color="neutral700"
            >{` / ${totalItems} ite${totalItems > 1 ? 'ns' : 'm'}`}</DefaultText>
          </View>
        </View>
        <DefaultButton
          title="Ver sacola"
          size="lg"
          onPress={() =>
            router.push({
              pathname: '/(logged)/(tabs)/(home)/r/[id]/checkout',
              params: { id: businessId },
            })
          }
        />
      </View>
    </View>
  );
};
