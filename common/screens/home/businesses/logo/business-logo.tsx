import { getBusinessLogoStoragePath } from '@/api/business/BusinessApi';
import { useImageURL } from '@/api/storage/useImageURL';
import colors from '@/common/styles/colors';
import { Image } from 'expo-image';
import { Skeleton } from 'moti/skeleton';
import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  businessId: string;
  size?: number;
  recyclingKey?: string;
}

export const BusinessLogo = ({ businessId, size = 60, recyclingKey, style, ...props }: Props) => {
  // state
  const url = useImageURL(getBusinessLogoStoragePath(businessId));
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
