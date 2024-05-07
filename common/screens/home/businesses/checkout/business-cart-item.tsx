import { useContextApi } from '@/api/ApiContext';
import { useProductAvailability } from '@/api/business/menu/products/useProductAvailability';
import { useProductImageURI } from '@/api/business/menu/products/useProductImageURI';
import { useObserveBusinessProduct } from '@/api/business/menu/useObserveBusinessProduct';
import { getItemTotal } from '@/api/orders/items/getItemTotal';
import { removeItemFromOrder } from '@/api/orders/items/removeItemFromOrder';
import { updateOrderItemQuantity } from '@/api/orders/items/updateOrderItemQuantity';
import { OnlyIconButton } from '@/common/components/buttons/icon/OnlyIconButton';
import { QuantityButton } from '@/common/components/buttons/quantity/quantity-button';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { HR } from '@/common/components/views/HR';
import { MessageBox } from '@/common/components/views/MessageBox';
import { formatCurrency } from '@/common/formatters/currency';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { Order, OrderItem, WithId } from '@appjusto/types';
import { router } from 'expo-router';
import { Pencil } from 'lucide-react-native';
import { Pressable, View, ViewProps } from 'react-native';
import { ProductImage } from '../detail/product-image';

interface Props extends ViewProps {
  item: OrderItem;
  order: WithId<Order>;
  editable?: boolean;
}

export const BusinessCartItem = ({ item, order, editable = true, style, ...props }: Props) => {
  // context
  const api = useContextApi();
  const businessId = order?.business?.id as string;
  const product = useObserveBusinessProduct(order.business?.id, item.product.id);
  // state
  const url = useProductImageURI(order?.business?.id, item);
  const availabilityWarning = useProductAvailability(product, order);
  // handlers
  const updateQuantity = (delta: number) => {
    if (!order) return;
    const quantity = item.quantity + delta;
    const updatedOrder =
      quantity > 0
        ? updateOrderItemQuantity(order, item.id, quantity)
        : removeItemFromOrder(order, item.id);
    api
      .orders()
      .updateOrder(order.id, updatedOrder)
      .catch(() => null);
  };
  // UI
  return (
    <View style={[{}, style]} {...props}>
      <View style={[{ flexDirection: 'row', alignItems: 'center', borderWidth: 0 }]} {...props}>
        <Pressable
          onPress={() => {
            router.navigate({
              pathname: '/(logged)/(tabs)/(home)/r/[businessId]/p/[productId]',
              params: { businessId, productId: item.product.id, itemId: item.id },
            });
          }}
        >
          <View>
            <ProductImage url={url} size={48} />
            {editable && url ? (
              <OnlyIconButton
                style={{ position: 'absolute', right: -14, top: -14 }}
                icon={<Pencil size={14} color={colors.black} />}
                variant="circle"
                size={32}
                onPress={() => null}
              />
            ) : null}
          </View>
        </Pressable>
        <View style={{ flex: 1, marginLeft: url ? paddings.xl : 0 }}>
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
          </View>
        </View>
        {editable ? (
          <QuantityButton
            quantity={item.quantity}
            minValue={0}
            onIncrement={() => updateQuantity(1)}
            onDecrement={() => updateQuantity(-1)}
          />
        ) : null}
      </View>
      {availabilityWarning ? (
        <MessageBox variant="warning" style={{ margin: paddings.lg }}>
          {availabilityWarning}
        </MessageBox>
      ) : null}
      <HR style={{ marginTop: paddings.lg }} />
    </View>
  );
};
