import { useImageURL } from '@/api/storage/useImageURL';
import { DefaultText } from '@/common/components/texts/DefaultText';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { Cuisine, WithId } from '@appjusto/types';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Skeleton } from 'moti/skeleton';
import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  item: WithId<Cuisine> | null;
  recyclingKey?: string;
}

const SIZE = 96;

export const CuisineListItem = ({ style, item, recyclingKey, ...props }: Props) => {
  // state
  const url = useImageURL(item?.imagePath);
  // UI
  return (
    <View>
      <Skeleton.Group show={!url}>
        <View
          style={{
            height: SIZE,
            width: SIZE,
            overflow: 'hidden',
            borderRadius: 8,
          }}
        >
          <Skeleton colors={[colors.neutral50, colors.neutral100]} width={SIZE} height={SIZE}>
            {url ? (
              <View>
                <Image
                  recyclingKey={recyclingKey}
                  style={{ width: SIZE, height: SIZE }}
                  contentFit="cover"
                  source={{ uri: url }}
                />
              </View>
            ) : null}
          </Skeleton>
        </View>
        <LinearGradient
          // Button Linear Gradient
          colors={['transparent', '#000']}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            borderBottomStartRadius: 8,
            borderBottomEndRadius: 8,
          }}
        >
          <DefaultText
            style={{
              textAlign: 'center',
              marginVertical: paddings.sm,
            }}
            size="xs"
            color="white"
          >
            {item?.name}
          </DefaultText>
        </LinearGradient>
      </Skeleton.Group>
    </View>
  );
};
