import { useContextBusiness } from '@/api/business/context/business-context';
import { useProductImageURI } from '@/api/business/menu/products/useProductImageURI';
import { useAddOrderItem } from '@/api/orders/items/useAddOrderItem';
import { DefaultText } from '@/common/components/texts/DefaultText';
import colors from '@/common/styles/colors';
import lineHeight from '@/common/styles/lineHeight';
import paddings from '@/common/styles/paddings';
import { Product, WithId } from '@appjusto/types';
import { Image } from 'expo-image';
import { Skeleton } from 'moti/skeleton';
import { Dimensions, View, ViewProps } from 'react-native';
import { ProductComplements } from './complement/product-complements';

interface Props extends ViewProps {
  product: WithId<Product>;
}

const HEIGHT = 200;
const WIDTH = Dimensions.get('screen').width;

export const ProductDetail = ({ product, style, ...props }: Props) => {
  // context
  const business = useContextBusiness();
  const businessId = business?.id;
  // state
  const {
    getTotalComplements,
    canAddComplement,
    getComplementQuantity,
    updateComplementQuantity,
    removeComplement,
    addComplement,
  } = useAddOrderItem(product.id);
  const url = useProductImageURI(businessId, product);
  // UI
  return (
    <View style={[{}, style]} {...props}>
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
        onComplementIncrement={(complementId) => updateComplementQuantity(complementId, 1)}
        onComplementDecrement={(complementId) => updateComplementQuantity(complementId, -1)}
        onComplementToggle={(group, complement, selected) => {
          if (!selected) removeComplement(complement.id);
          else if (canAddComplement(group)) addComplement(group, complement);
        }}
      />
    </View>
  );
};
