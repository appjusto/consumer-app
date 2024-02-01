import { useContextApi } from '@/api/ApiContext';
import { useProductImageURI } from '@/api/business/menu/products/useProductImageURI';
import { useContextOrderQuote } from '@/api/orders/context/order-context';
import { getItemTotal } from '@/api/orders/items/getItemTotal';
import { removeItemFromOrder } from '@/api/orders/items/removeItemFromOrder';
import { updateOrderItemQuantity } from '@/api/orders/items/updateOrderItemQuantity';
import { OnlyIconButton } from '@/common/components/buttons/icon/OnlyIconButton';
import { QuantityButton } from '@/common/components/buttons/quantity/quantity-button';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { HR } from '@/common/components/views/HR';
import { formatCurrency } from '@/common/formatters/currency';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { OrderItem } from '@appjusto/types';
import { router } from 'expo-router';
import { Pencil } from 'lucide-react-native';
import { Pressable, View, ViewProps } from 'react-native';
import { ProductImage } from '../detail/product-image';

interface Props extends ViewProps {
  item: OrderItem;
}

export const BusinessCartItem = ({ item, style, ...props }: Props) => {
  // context
  const api = useContextApi();
  const quote = useContextOrderQuote();
  const businessId = quote?.business?.id as string;
  // state
  const url = useProductImageURI(quote?.business?.id, item);
  // side effects
  const updateQuantity = (delta: number) => {
    if (!quote) return;
    const quantity = item.quantity + delta;
    const updatedOrder =
      quantity > 0
        ? updateOrderItemQuantity(quote, item.id, quantity)
        : removeItemFromOrder(quote, item.id);
    api
      .orders()
      .updateOrder(quote.id, updatedOrder)
      .catch(() => null);
  };
  // UI
  return (
    <View style={[{}, style]} {...props}>
      <View style={[{ flexDirection: 'row', borderWidth: 0 }]} {...props}>
        <Pressable
          onPress={() =>
            router.navigate({
              pathname: '/(logged)/(tabs)/(home)/r/[id]/p/[productId]',
              params: { id: businessId, productId: item.product.id, itemId: item.id },
            })
          }
        >
          <View>
            <ProductImage url={url} size={48} />
            <OnlyIconButton
              style={{ position: 'absolute', right: -14, top: -14 }}
              icon={<Pencil size={14} color={colors.black} />}
              variant="circle"
              size={32}
              onPress={() => null}
            />
          </View>
        </Pressable>
        <View style={{ flex: 1, marginLeft: paddings.xl }}>
          {/* name */}
          <DefaultText size="md">{item.product.name}</DefaultText>
          {/* notes */}
          {item.notes ? (
            <DefaultText style={{ marginTop: paddings.xs }} size="xs" color="neutral700">
              {item.notes}
            </DefaultText>
          ) : null}
          {/* complements */}
          <View style={{ minHeight: 0 }}>
            {(item.complements ?? []).map((complement) => (
              <View style={{ marginTop: paddings.xs }} key={complement.complementId}>
                <DefaultText
                  size="xs"
                  color="neutral700"
                >{`${complement.quantity} ${complement.name}`}</DefaultText>
              </View>
            ))}
          </View>
          {/* price & quantity */}
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderWidth: 0,
            }}
          >
            <DefaultText color="neutral800">{formatCurrency(getItemTotal(item))}</DefaultText>
            <QuantityButton
              quantity={item.quantity}
              minValue={0}
              onIncrement={() => updateQuantity(1)}
              onDecrement={() => updateQuantity(-1)}
            />
          </View>
        </View>
      </View>
      <HR style={{ marginTop: paddings.lg }} />
    </View>
  );
};
