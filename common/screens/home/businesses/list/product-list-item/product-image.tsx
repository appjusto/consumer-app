import { useProductImageURI } from '@/api/business/menu/products/useProductImageURI';
import colors from '@/common/styles/colors';
import { ProductAlgolia } from '@appjusto/types';
import { Image } from 'expo-image';
import { Skeleton } from 'moti/skeleton';
import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  businessId: string;
  product: ProductAlgolia;
  size?: number;
  recyclingKey?: string;
}

export const BusinessLogo = ({
  businessId,
  product,
  size = 60,
  recyclingKey,
  style,
  ...props
}: Props) => {
  // state
  const url = useProductImageURI(businessId, product);
  // UI
  return (
    <View style={[{ borderRadius: 8, overflow: 'hidden' }, style]}>
      <Skeleton.Group show={!url}>
        <Skeleton colors={[colors.neutral50, colors.neutral100]} width={size} height={size}>
          <View>
            {url ? (
              <Image
                recyclingKey={recyclingKey}
                style={{ width: size, height: size }}
                contentFit="cover"
                source={{ uri: url }}
              />
            ) : null}
          </View>
        </Skeleton>
      </Skeleton.Group>
    </View>
  );
};
