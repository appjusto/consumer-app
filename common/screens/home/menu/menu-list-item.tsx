import { useProductImageURI } from '@/api/business/menu/products/useProductImageURI';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { HR } from '@/common/components/views/HR';
import { formatCurrency } from '@/common/formatters/currency';
import colors from '@/common/styles/colors';
import lineHeight from '@/common/styles/lineHeight';
import paddings from '@/common/styles/paddings';
import { Product, WithId } from '@appjusto/types';
import { Image } from 'expo-image';
import { Skeleton } from 'moti/skeleton';
import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  businessId: string;
  item: WithId<Product>;
  recyclingKey?: string;
}

const LOGO_SIZE = 100;

export const MenuListItem = ({ businessId, item, recyclingKey, style, ...props }: Props) => {
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
        <View style={{ marginLeft: paddings.sm, borderRadius: 8, overflow: 'hidden' }}>
          <Skeleton.Group show={!url}>
            <Skeleton
              colors={[colors.neutral50, colors.neutral100]}
              width={LOGO_SIZE}
              height={LOGO_SIZE}
            >
              <View>
                {url ? (
                  <Image
                    recyclingKey={recyclingKey}
                    style={{ width: LOGO_SIZE, height: LOGO_SIZE }}
                    contentFit="cover"
                    source={{ uri: url }}
                  />
                ) : null}
              </View>
            </Skeleton>
          </Skeleton.Group>
        </View>
      </View>
      <HR style={{ marginHorizontal: paddings.lg }} />
    </View>
  );
};
