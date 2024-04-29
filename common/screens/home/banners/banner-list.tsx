import { useBanners } from '@/api/banners/useBanners';
import { processURL } from '@/common/deeplink/processURL';
import paddings from '@/common/styles/paddings';
import { Banner, WithId } from '@appjusto/types';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { Linking, Pressable, View, ViewProps } from 'react-native';
import { BANNER_ITEM_WIDTH, BannerListItem } from './banner-list-item';

interface Props extends ViewProps {}

const keyExtractor = (item: WithId<Banner> | null, index: number) => item?.id ?? `${index}`;

export const BannerList = ({ style, ...props }: Props) => {
  // state
  const banners = useBanners() ?? [null, null];
  // UI
  if (banners.length === 0) return null;
  return (
    <View style={[{}, style]} {...props}>
      <FlashList
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={keyExtractor}
        data={banners}
        renderItem={({ item, index }) => {
          return (
            <Pressable
              onPress={() => {
                if (!item?.link) return;
                const deeplink = processURL(item.link);
                if (deeplink) router.navigate(deeplink);
                else Linking.openURL(item.link);
              }}
            >
              {() => (
                <View style={{ marginLeft: index > 0 ? paddings.lg : 0 }}>
                  <BannerListItem
                    // breaks recycling but it's okay with this list
                    key={keyExtractor(item, index)}
                    item={item}
                    recyclingKey={keyExtractor(item, index)}
                  />
                </View>
              )}
            </Pressable>
          );
        }}
        estimatedItemSize={BANNER_ITEM_WIDTH}
      />
    </View>
  );
};
