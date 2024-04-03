import { useProductImageURI } from '@/api/business/menu/products/useProductImageURI';
import { useObserveBusiness } from '@/api/business/useObserveBusiness';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { formatCurrency } from '@/common/formatters/currency';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { ProductAlgolia } from '@appjusto/types';
import { router } from 'expo-router';
import { Pressable, ScrollView, View, ViewProps } from 'react-native';
import { ProductImage } from '../../detail/product-image';
import { AppJustoOnlyIcon } from '../../icons/appjusto-only-icon';
import { BusinessLogo } from '../../logo/business-logo';
import { BusinessBadges } from './business-badges';
import { BusinessItemInfo } from './business-info';

interface Props extends ViewProps {
  products: ProductAlgolia[];
  recyclingKey?: string;
}

export const SearchGroupedProductsListItem = ({
  style,
  products,
  recyclingKey,
  ...props
}: Props) => {
  const businessId = products[0]?.business?.id;
  const business = useObserveBusiness(businessId);
  if (!business) return null;
  const appjustoOnly = business.tags?.includes('appjusto-only');
  // UI
  return (
    <View style={{ marginBottom: paddings.xl }}>
      <Pressable
        onPress={() =>
          router.navigate({
            pathname: '/(logged)/(tabs)/(home)/r/[businessId]/',
            params: { businessId: business.id },
          })
        }
      >
        {({ pressed }) => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: paddings.sm,
              borderWidth: 0,
            }}
          >
            <BusinessLogo businessId={business.id} />
            <View style={{ marginLeft: paddings.md }}>
              {/* first line */}
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <DefaultText>{business.name}</DefaultText>
                {appjustoOnly ? <AppJustoOnlyIcon style={{ marginLeft: paddings.sm }} /> : null}
              </View>
              {/* second line */}
              <BusinessItemInfo style={{ marginTop: paddings.xs }} business={business} />
              {/* third line */}
              <BusinessBadges business={business} style={{ marginTop: paddings.xs }} />
            </View>
          </View>
        )}
      </Pressable>
      <View>
        <ScrollView
          style={{ marginTop: paddings.sm }}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {products.map((product) => (
            <ProductItem
              style={{ marginRight: paddings.lg }}
              key={product.objectID}
              product={product}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

interface PProps extends ViewProps {
  product: ProductAlgolia;
}

const ProductItem = ({ product, ...props }: PProps) => {
  // console.log('ProductItem', product);
  const productId = product.objectID;
  const businessId = product.business.id;
  const url = useProductImageURI(businessId, product);
  // UI
  return (
    <Pressable
      onPress={() => {
        router.navigate({
          pathname: '/(logged)/(tabs)/(home)/r/[businessId]/',
          params: { businessId },
        });
        router.navigate({
          pathname: '/(logged)/(tabs)/(home)/r/[businessId]/p/[productId]',
          params: { businessId, productId },
        });
      }}
      {...props}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: paddings.sm,
          borderWidth: 1,
          borderColor: colors.neutral100,
          borderRadius: 4,
        }}
      >
        <ProductImage style={{ marginLeft: paddings.sm }} url={url} size={50} recyclingKey={url} />
        <View style={{ margin: paddings.sm }}>
          <DefaultText style={{}}>{product.name}</DefaultText>
          <DefaultText style={{ marginTop: paddings.sm }} color="primary900">
            {formatCurrency(product.price)}
          </DefaultText>
        </View>
      </View>
    </Pressable>
  );
};
