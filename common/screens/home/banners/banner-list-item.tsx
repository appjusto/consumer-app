import { getBannerStoragePath } from '@/api/banners/BannerApi';
import { getDownloadURL } from '@/api/storage/getDownloadURL';
import colors from '@/common/styles/colors';
import { Banner, WithId } from '@appjusto/types';
import { Image } from 'expo-image';
import { Skeleton } from 'moti/skeleton';
import { useCallback, useEffect, useState } from 'react';
import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  item: WithId<Banner> | null;
  recyclingKey?: string;
}

// export const BANNER_ITEM_WIDTH = 300;
// export const BANNER_ITEM_HEIGHT = 142;
export const BANNER_ITEM_WIDTH = 320;
export const BANNER_ITEM_HEIGHT = 100;

export const BannerListItem = ({ style, item, recyclingKey, ...props }: Props) => {
  // state
  const [url, setURL] = useState<string | null>();
  // helpers
  const fetchDownloadURL = useCallback(async () => {
    if (!item) return;
    try {
      return await getDownloadURL(getBannerStoragePath(item, '_320x100'));
    } catch (error: any) {
      console.log(error);
      return null;
    }
  }, [item]);
  // side effects
  useEffect(() => {
    fetchDownloadURL()
      .then(setURL)
      .catch((error) => {
        console.log(error);
      });
  }, [fetchDownloadURL]);

  // UI
  return (
    <View
      style={{
        width: BANNER_ITEM_WIDTH,
        height: BANNER_ITEM_HEIGHT,
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      <Skeleton.Group show={!url}>
        <Skeleton
          colors={[colors.neutral50, colors.neutral100]}
          width={BANNER_ITEM_WIDTH}
          height={BANNER_ITEM_HEIGHT}
        >
          <View>
            {url ? (
              <Image
                recyclingKey={recyclingKey}
                style={{ width: BANNER_ITEM_WIDTH, height: BANNER_ITEM_HEIGHT }}
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
