import { useContextApi } from '@/api/ApiContext';
import { useContextBusinessQuote } from '@/api/business/context/business-context';
import { useProductImageURI } from '@/api/business/menu/products/useProductImageURI';
import { getItemTotal } from '@/api/orders/items/getItemTotal';
import { removeItemFromOrder } from '@/api/orders/items/removeItemFromOrder';
import { updateOrderItemQuantity } from '@/api/orders/items/updateOrderItemQuantity';
import { QuantityButton } from '@/common/components/buttons/quantity/quantity-button';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { HR } from '@/common/components/views/HR';
import { formatCurrency } from '@/common/formatters/currency';
import paddings from '@/common/styles/paddings';
import { OrderItem } from '@appjusto/types';
import { View, ViewProps } from 'react-native';
import { ProductImage } from '../detail/product-image';

interface Props extends ViewProps {
  item: OrderItem;
}

export const BusinessCartItem = ({ item, style, ...props }: Props) => {
  // context
  const api = useContextApi();
  const quote = useContextBusinessQuote();
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
        <ProductImage url={url} size={48} />
        <View style={{ flex: 1, marginLeft: paddings.lg }}>
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
