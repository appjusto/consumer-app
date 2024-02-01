import { getBusinessCoverStoragePath } from '@/api/business/business-api';
import { useImageURL } from '@/api/storage/useImageURL';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { Image } from 'expo-image';
import { Skeleton } from 'moti/skeleton';
import { Dimensions, View, ViewProps } from 'react-native';
import { BusinessLogo } from '../../logo/business-logo';
interface Props extends ViewProps {
  businessId: string;
}

const WIDTH = Dimensions.get('screen').width;
const HEIGHT = 150;

export const BusinessHeader = ({ businessId, style, ...props }: Props) => {
  // state
  const coverUrl = useImageURL(getBusinessCoverStoragePath(businessId));
  // UI
  return (
    <View style={[{}, style]} {...props}>
      <Skeleton.Group show={!coverUrl}>
        <Skeleton colors={[colors.neutral50, colors.neutral100]} width={WIDTH} height={HEIGHT}>
          {coverUrl ? (
            <Image style={{ height: HEIGHT }} contentFit="cover" source={{ uri: coverUrl }} />
          ) : null}
        </Skeleton>
        <BusinessLogo
          style={{ position: 'absolute', alignSelf: 'center', left: paddings.lg, top: 25 }}
          businessId={businessId}
          size={100}
        />
      </Skeleton.Group>
    </View>
  );
};
