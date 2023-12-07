import { getDownloadURL } from '@/api/storage/getDownloadURL';
import colors from '@/common/styles/colors';
import { Cuisine, WithId } from '@appjusto/types';
import { Image } from 'expo-image';
import { Skeleton } from 'moti/skeleton';
import { useCallback, useEffect, useState } from 'react';
import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  item: WithId<Cuisine> | null;
  recyclingKey?: string;
}

const SIZE = 96;

export const CuisineListItem = ({ style, item, recyclingKey, ...props }: Props) => {
  // state
  const [url, setURL] = useState<string | null>();
  // helpers
  const fetchDownloadURL = useCallback(async () => {
    if (!item) return;
    try {
      return await getDownloadURL(item.imagePath);
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
    <View style={{ height: SIZE, width: SIZE, borderRadius: 8, overflow: 'hidden' }}>
      <Skeleton.Group show={!url}>
        <Skeleton colors={[colors.neutral50, colors.neutral100]} width={SIZE} height={SIZE}>
          <View>
            {url ? (
              <Image
                recyclingKey={recyclingKey}
                style={{ width: SIZE, height: SIZE }}
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
