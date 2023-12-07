import { DefaultText } from '@/common/components/texts/DefaultText';
import paddings from '@/common/styles/paddings';
import { Product, WithId } from '@appjusto/types';
import { FlashList, FlashListProps } from '@shopify/flash-list';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { MenuListHeader } from './header/menu-list-header';
import { MenuListItem } from './menu-list-item';

interface Props<P> extends Omit<FlashListProps<P>, 'renderItem'> {
  businessId: string;
}

export const MenuList = ({ businessId, style, ...props }: Props<string | WithId<Product>>) => {
  // UI
  return (
    <FlashList
      {...props}
      keyExtractor={(item) => (typeof item === 'string' ? item : item.id)}
      ListHeaderComponent={<MenuListHeader businessId={businessId} />}
      renderItem={({ item, index }) => {
        console.log(item);
        if (typeof item === 'string')
          return (
            <View style={{ marginTop: paddings.xl, marginLeft: paddings.lg }}>
              <DefaultText size="md">{item}</DefaultText>
            </View>
          );
        return (
          <Pressable
            onPress={() =>
              router.push({
                pathname: '/(logged)/r/[id]/p/[productId]',
                params: { id: businessId, productId: item.id },
              })
            }
          >
            {({ pressed }) => <MenuListItem businessId={businessId} item={item} />}
          </Pressable>
        );
      }}
      estimatedItemSize={78}
    />
  );
};
