import { useContextApi } from '@/api/ApiContext';
import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import {
  useContextBusiness,
  useContextBusinessProduct,
  useContextBusinessQuote,
} from '@/api/business/context/business-context';
import { useProductImageURI } from '@/api/business/menu/products/useProductImageURI';
import { addItemToOrder } from '@/api/orders/items/addItemToOrder';
import { getItemTotal } from '@/api/orders/items/getItemTotal';
import { removeItemFromOrder } from '@/api/orders/items/removeItemFromOrder';
import { useAddOrderItem } from '@/api/orders/items/useAddOrderItem';
import { useContextCurrentPlace } from '@/api/preferences/context/PreferencesContext';
import { useContextProfile } from '@/common/auth/AuthContext';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { Loading } from '@/common/components/views/Loading';
import colors from '@/common/styles/colors';
import lineHeight from '@/common/styles/lineHeight';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Place } from '@appjusto/types';
import { Image } from 'expo-image';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Skeleton } from 'moti/skeleton';
import { Dimensions, View, ViewProps } from 'react-native';
import { ProductComplements } from '../complement/product-complements';
import { AddProductToOrder } from './add-product-to-order';

interface Props extends ViewProps {}

const HEIGHT = 200;
const WIDTH = Dimensions.get('screen').width;

export const ProductDetail = ({ style, ...props }: Props) => {
  // params
  const params = useLocalSearchParams<{ id: string; productId: string; itemId: string }>();
  const businessId = params.id;
  const productId = params.productId;
  const itemId = params.itemId;
  // context
  const api = useContextApi();
  const profile = useContextProfile();
  const currentPlace = useContextCurrentPlace();
  const quote = useContextBusinessQuote();
  const business = useContextBusiness();
  // state
  const product = useContextBusinessProduct(productId);
  const {
    canAddItem,
    quantity,
    setQuantity,
    canAddComplement,
    getTotalComplements,
    getComplementQuantity,
    updateComplementQuantity,
    toggleComplement,
    getOrderItem,
  } = useAddOrderItem(productId, itemId);
  const url = useProductImageURI(businessId, product);
  const orderItem = getOrderItem();
  // tracking
  useTrackScreenView('Produto', { businessId, productId });
  // handlers
  const updateOrder = async () => {
    if (!profile) return;
    if (!currentPlace) return;
    if (!business) return;
    if (!orderItem?.id) return;
    if (!quote) {
      // create order
      console.log(orderItem);
      await api.orders().createFoodOrder(business, [orderItem], currentPlace as Place);
    } else {
      // update order
      const updatedOrder =
        quantity > 0 ? addItemToOrder(quote, orderItem) : removeItemFromOrder(quote, orderItem.id);
      await api.orders().updateOrder(quote.id, updatedOrder);
    }
    router.back();
  };
  const addToOrderDisabled = !profile || !currentPlace || !business || !orderItem || !canAddItem;
  // console.log(!profile, !currentPlace, !business, !orderItem, !canAddItem);
  // UI
  if (!product || quote === undefined) return <Loading />;
  return (
    <View style={[{ ...screens.default }, style]} {...props}>
      <Stack.Screen options={{ title: product.name }} />
      <DefaultScrollView>
        {/* image */}
        <Skeleton.Group show={!url}>
          <Skeleton colors={[colors.neutral50, colors.neutral100]} width={WIDTH} height={HEIGHT}>
            {url ? (
              <Image style={{ height: HEIGHT }} contentFit="cover" source={{ uri: url }} />
            ) : null}
          </Skeleton>
        </Skeleton.Group>
        {/* name / description */}
        <View style={{ paddingVertical: paddings.xl, paddingHorizontal: paddings.lg }}>
          <DefaultText size="lg">{product.name}</DefaultText>
          <DefaultText
            style={{ marginVertical: paddings.lg, ...lineHeight.sm, flexWrap: 'wrap' }}
            color="neutral800"
          >
            {product.description}
          </DefaultText>
        </View>
        {/* complements */}
        <ProductComplements
          product={product}
          getTotalComplements={getTotalComplements}
          canAddComplement={canAddComplement}
          getComplementQuantity={getComplementQuantity}
          onComplementIncrement={(group, complement) =>
            updateComplementQuantity(group, complement, 1)
          }
          onComplementDecrement={(group, complement) =>
            updateComplementQuantity(group, complement, -1)
          }
          onComplementToggle={(group, complement, added) =>
            toggleComplement(group, complement, added)
          }
        />
      </DefaultScrollView>
      <AddProductToOrder
        quantity={quantity}
        total={getItemTotal(getOrderItem())}
        editing={Boolean(itemId)}
        disabled={addToOrderDisabled}
        onSetQuantity={(value) => setQuantity(value)}
        onAddItemToOrder={updateOrder}
      />
    </View>
  );
};
