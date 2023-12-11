import { useProductImageURI } from '@/api/business/menu/products/useProductImageURI';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { HR } from '@/common/components/views/HR';
import { formatCurrency } from '@/common/formatters/currency';
import lineHeight from '@/common/styles/lineHeight';
import paddings from '@/common/styles/paddings';
import { Product, WithId } from '@appjusto/types';
import { View, ViewProps } from 'react-native';
import { ProductImage } from './product-image';

interface Props extends ViewProps {
  businessId: string;
  item: WithId<Product>;
  recyclingKey?: string;
}

export const ProductListItem = ({ businessId, item, recyclingKey, style, ...props }: Props) => {
  // state
  const url = useProductImageURI(businessId, item);
  // UI
  return (
    <View style={[{ borderWidth: 0 }, style]}>
      <View
        style={{ flexDirection: 'row', alignItems: 'center', padding: paddings.lg, borderWidth: 0 }}
      >
        <View style={{ flex: 1 }}>
          <DefaultText>{item.name}</DefaultText>
          <View style={{}}>
            <DefaultText
              style={{
                ...lineHeight.sm,
                marginVertical: paddings.sm,
                flexWrap: 'wrap',
                textAlignVertical: 'center',
              }}
              color="neutral800"
              size="xs"
              numberOfLines={2}
            >
              {item.description}
            </DefaultText>
          </View>
          <DefaultText color="primary900">{formatCurrency(item.price)}</DefaultText>
        </View>
        {/* image */}
        <ProductImage
          style={{ marginLeft: paddings.sm }}
          url={url}
          size={100}
          recyclingKey={recyclingKey}
        />
      </View>
      <HR style={{ marginHorizontal: paddings.lg }} />
    </View>
  );
};
