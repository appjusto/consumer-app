import { useContextApi } from '@/api/ApiContext';
import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import {
  useContextBusiness,
  useContextBusinessProduct,
} from '@/api/business/context/business-context';
import { useProductImageURI } from '@/api/business/menu/products/useProductImageURI';
import { useCheckoutIssues } from '@/api/orders/checkout/useCheckoutIssues';
import { useContextBusinessQuote } from '@/api/orders/context/order-context';
import { addItemToOrder } from '@/api/orders/items/addItemToOrder';
import { getItemTotal } from '@/api/orders/items/getItemTotal';
import { removeItemFromOrder } from '@/api/orders/items/removeItemFromOrder';
import { useAddOrderItem } from '@/api/orders/items/useAddOrderItem';
import { useContextCurrentPlace } from '@/api/preferences/context/PreferencesContext';
import { useContextIsUserAnonymous, useContextProfile } from '@/common/auth/AuthContext';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { DefaultKeyboardAwareScrollView } from '@/common/components/containers/DefaultKeyboardAwareScrollView';
import { DefaultInput } from '@/common/components/inputs/default/DefaultInput';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { MessageBox } from '@/common/components/views/MessageBox';
import { useShowToast } from '@/common/components/views/toast/ToastContext';
import { getAppjustoDomain } from '@/common/constants/urls';
import { ProductComplements } from '@/common/screens/home/businesses/detail/complement/product-complements';
import { AddProductToOrder } from '@/common/screens/home/businesses/detail/product/add-product-to-order';
import { ScreenTitle } from '@/common/screens/title/screen-title';
import colors from '@/common/styles/colors';
import lineHeight from '@/common/styles/lineHeight';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Place } from '@appjusto/types';
import * as Clipboard from 'expo-clipboard';
import { Image } from 'expo-image';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Share2 } from 'lucide-react-native';
import { Skeleton } from 'moti/skeleton';
import { Dimensions, Pressable, View } from 'react-native';

const HEIGHT = 200;
const WIDTH = Dimensions.get('screen').width;

export default function ProductDetailScreen() {
  // params
  const params = useLocalSearchParams<{ businessId: string; productId: string; itemId: string }>();
  const businessId = params.businessId;
  const productId = params.productId;
  const itemId = params.itemId;
  // context
  const showToast = useShowToast();
  const api = useContextApi();
  const isAnonymous = useContextIsUserAnonymous();
  const profile = useContextProfile();
  const currentPlace = useContextCurrentPlace();
  const quote = useContextBusinessQuote();
  const business = useContextBusiness();
  // state
  const product = useContextBusinessProduct(productId);
  const {
    canAddItem,
    quantity,
    notes,
    setNotes,
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
  const issues = useCheckoutIssues(false, false);
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
      await api
        .orders()
        .createFoodOrder(business, { items: [orderItem], destination: currentPlace as Place });
    } else {
      // update order
      const updatedOrder =
        quantity > 0 ? addItemToOrder(quote, orderItem) : removeItemFromOrder(quote, orderItem.id);
      await api.orders().updateOrder(quote.id, updatedOrder);
    }
    router.back();
  };
  const copyToClipboard = () => {
    if (!business) return;
    Clipboard.setStringAsync(
      `https://${getAppjustoDomain()}/r/${business.slug ?? business.id}`
      // `https://${getAppjustoDomain()}/r/${business.slug ?? business.id}/p/${productId}`
    ).then(() => {
      showToast('Link do restaurante copiado!', 'success');
    });
  };
  // UI
  const addToOrderDisabled =
    issues.length > 0 || !profile || !currentPlace || !business || !orderItem || !canAddItem;
  // console.log(!profile, !currentPlace, !business, !orderItem, !canAddItem);
  // console.log('product', product);
  // console.log('quote', quote);
  if (!product || quote === undefined) return <ScreenTitle title="Produto" loading />;
  return (
    <View style={{ ...screens.default }}>
      <Stack.Screen
        options={{
          title: product.name,
          headerRight: (props) => (
            <Pressable onPress={copyToClipboard}>
              {() => <Share2 size={16} color={colors.neutral900} />}
            </Pressable>
          ),
        }}
      />
      <DefaultKeyboardAwareScrollView>
        {/* image */}
        {url !== null ? (
          <Skeleton.Group show={!url}>
            <Skeleton colors={[colors.neutral50, colors.neutral100]} width={WIDTH} height={HEIGHT}>
              {url ? (
                <Image
                  style={{ height: HEIGHT }}
                  contentFit="cover"
                  source={{ uri: url }}
                  cachePolicy="none"
                />
              ) : null}
            </Skeleton>
          </Skeleton.Group>
        ) : null}
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
        {!isAnonymous ? (
          <DefaultInput
            inputStyle={{ minHeight: 60 }}
            title="Informações adicionais"
            placeholder="Tem alguma observação? Por exemplo: sem molho, sem cebola, ponto da carne, etc"
            style={{ margin: paddings.lg }}
            multiline
            textAlignVertical="top"
            value={notes}
            onChangeText={setNotes}
            blurOnSubmit
            returnKeyType="done"
          />
        ) : null}
        {issues.length ? (
          <MessageBox variant="warning" style={{ margin: paddings.lg }}>
            {issues[0].description}
          </MessageBox>
        ) : null}
      </DefaultKeyboardAwareScrollView>
      {isAnonymous || !currentPlace ? (
        <DefaultButton
          style={{ margin: paddings.lg }}
          title={isAnonymous ? 'Fazer login para pedir' : 'Definir local de entrega'}
          onPress={() =>
            isAnonymous
              ? router.navigate('/(home)/sign-in')
              : router.navigate({ pathname: '/places/new' })
          }
        />
      ) : (
        <AddProductToOrder
          quantity={quantity}
          total={getItemTotal(getOrderItem())}
          editing={Boolean(itemId)}
          disabled={addToOrderDisabled}
          onSetQuantity={(value) => setQuantity(value)}
          onAddItemToOrder={updateOrder}
        />
      )}
    </View>
  );
}
