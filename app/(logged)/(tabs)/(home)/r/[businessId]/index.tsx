import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import {
  useContextBusiness,
  useContextBusinessCategories,
  useContextBusinessProducts,
} from '@/api/business/context/business-context';
import { useContextBusinessQuote } from '@/api/orders/context/order-context';
import { HorizontalSelector } from '@/common/components/containers/horizontal-selector/horizontal-selector';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { CartButton } from '@/common/screens/home/businesses/detail/footer/cart-button';
import { BusinessHeader } from '@/common/screens/home/businesses/detail/header/business-header';
import { ProductListItem } from '@/common/screens/home/businesses/detail/product-list-item';
import { ScreenTitle } from '@/common/screens/title/screen-title';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Product, WithId } from '@appjusto/types';
import { FlashList } from '@shopify/flash-list';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, View } from 'react-native';

export default function BusinessDetailScreen() {
  // params
  const params = useLocalSearchParams<{ businessId: string }>();
  const businessId = params.businessId;
  // context
  const business = useContextBusiness();
  const categories = useContextBusinessCategories();
  const products = useContextBusinessProducts();
  const quote = useContextBusinessQuote();
  const orderId = quote?.id;
  // refs
  const ref = useRef<FlashList<WithId<Product> | string>>(null);
  // state
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [nextCategoryIndex, setNextCategoryIndex] = useState(0);
  const [headerHidden, setHeaderHidden] = useState(false);
  // tracking
  useTrackScreenView('Restaurante', { businessId });
  // handlers
  const productHandler = (productId: string) =>
    router.navigate({
      pathname: '/(logged)/(tabs)/(home)/r/[businessId]/p/[productId]',
      params: { businessId, productId },
    });
  const checkoutHandler = () => {
    if (!orderId) return;
    router.navigate({
      pathname: '/(logged)/checkout/[orderId]/',
      params: { orderId },
    });
  };
  // scroll handling
  // showing/hiding header
  // const scrollHandler = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
  //   setHeaderHidden(event.nativeEvent.contentOffset.y > 300);
  // };
  // scolling product list to right section
  const categoryHandler = (index: number) => {
    if (!categories) return;
    const item = categories[index];
    if (!item) return;
    setNextCategoryIndex(index);
    setCategoryIndex(index);
    if (item) ref.current?.scrollToItem({ item, animated: true });
  };
  // UI
  if (!business || !products || !businessId) return <ScreenTitle title="Restaurante" loading />;
  return (
    <View style={{ ...screens.default }}>
      <ScreenTitle title={business.name} />
      {headerHidden && categories?.length && categories.length > 1 ? (
        <HorizontalSelector
          style={{ margin: paddings.lg }}
          data={categories.map((value) => ({ title: value }))}
          selectedIndex={categoryIndex}
          size="sm"
          onSelect={categoryHandler}
        />
      ) : null}
      <FlashList
        ref={ref}
        data={products}
        keyExtractor={(item) => (typeof item === 'string' ? item : item.id)}
        ListHeaderComponent={
          <BusinessHeader
            business={business}
            hidden={headerHidden}
            categories={categories}
            categoryIndex={categoryIndex}
            onCategorySelect={categoryHandler}
          />
        }
        // onScroll={scrollHandler}
        onMomentumScrollEnd={(ev) => {
          setCategoryIndex(nextCategoryIndex);
          // scrollHandler(ev);
        }}
        onViewableItemsChanged={(info) => {
          const item = info.changed.slice().find((v) => v.isViewable && typeof v.item === 'string');
          if (item?.item) {
            const nextIndex = categories?.findIndex((value) => value === item.item) ?? 0;
            setNextCategoryIndex(nextIndex);
          }
        }}
        renderItem={({ item, index }) => {
          if (typeof item === 'string')
            return (
              <View style={{ marginTop: paddings.xl, marginLeft: paddings.lg }}>
                <DefaultText size="md">{item}</DefaultText>
              </View>
            );
          return (
            <Pressable onPress={() => productHandler(item.id)}>
              {({ pressed }) => <ProductListItem businessId={businessId} item={item} />}
            </Pressable>
          );
        }}
        estimatedItemSize={78}
      />
      <CartButton
        order={quote}
        title="Ver sacola"
        variant="total-products"
        disabled={!quote}
        onPress={checkoutHandler}
      />
    </View>
  );
}
