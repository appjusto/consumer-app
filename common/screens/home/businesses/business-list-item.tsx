import { getBusinessLogoStoragePath } from '@/api/business/BusinessApi';
import { getDownloadURL } from '@/api/storage/getDownloadURL';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { RoundedText } from '@/common/components/texts/RoundedText';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { BusinessAlgolia } from '@appjusto/types';
import { Image } from 'expo-image';
import { Skeleton } from 'moti/skeleton';
import { useCallback, useEffect, useState } from 'react';
import { View, ViewProps } from 'react-native';
import { BusinessListItemReview } from './business-list-item-reviews';

interface Props extends ViewProps {
  item: BusinessAlgolia;
  recyclingKey?: string;
}

const LOGO_SIZE = 60;

export const BusinessListItem = ({ style, item, recyclingKey, ...props }: Props) => {
  // state
  const [url, setURL] = useState<string | null>();
  // helpers
  const fetchDownloadURL = useCallback(async () => {
    if (!item) return;
    try {
      return await getDownloadURL(getBusinessLogoStoragePath(item.objectID));
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
    <View style={{ flexDirection: 'row', padding: paddings.sm }}>
      {/* logo */}
      <View style={{ borderRadius: 8, overflow: 'hidden' }}>
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
      <View style={{ marginLeft: paddings.sm }}>
        <DefaultText>{item.name}</DefaultText>
        <View style={{ flexDirection: 'row', marginTop: paddings.xs }}>
          <BusinessListItemReview item={item} />
        </View>
        {item.averageDiscount ? (
          <RoundedText>{`${item.averageDiscount}% de descconto`}</RoundedText>
        ) : null}
      </View>
    </View>
  );
};
