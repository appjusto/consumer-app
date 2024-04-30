import colors from '@/common/styles/colors';
import { Image } from 'expo-image';
import { Skeleton } from 'moti/skeleton';
import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  url: string | undefined | null;
  size: number;
  recyclingKey?: string;
}

export const ProductImage = ({ url, size, recyclingKey, style, ...props }: Props) => {
  if (url === null) return null;
  return (
    <View style={[{ borderRadius: 8, overflow: 'hidden' }, style]} {...props}>
      <Skeleton.Group show={url === undefined}>
        <Skeleton colors={[colors.neutral50, colors.neutral100]} width={size} height={size}>
          <View>
            {url ? (
              <Image
                recyclingKey={recyclingKey}
                style={{ width: size, height: size, borderRadius: 8 }}
                contentFit="cover"
                source={{ uri: url }}
                cachePolicy="none"
              />
            ) : null}
          </View>
        </Skeleton>
      </Skeleton.Group>
    </View>
  );
};
