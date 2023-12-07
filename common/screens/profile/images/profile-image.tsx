import { useImageURL } from '@/api/storage/useImageURL';
import { CircledView } from '@/common/components/containers/CircledView';
import { Loading } from '@/common/components/views/Loading';
import { Image } from 'expo-image';
import { View } from 'react-native';

interface Props {
  path?: string | null;
  size?: number;
}

export default function ProfileImage({ path, size = 60 }: Props) {
  // state
  const url = useImageURL(path);
  // UI
  return (
    <View style={{ flexDirection: 'row' }}>
      <CircledView size={size} style={{ borderWidth: 0 }}>
        {url ? (
          <Image style={{ width: size, height: size }} source={{ uri: url }} contentFit="cover" />
        ) : (
          <Loading size="small" />
        )}
      </CircledView>
    </View>
  );
}
