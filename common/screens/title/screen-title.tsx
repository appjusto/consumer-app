import { Loading } from '@/common/components/views/Loading';
import { Stack } from 'expo-router';
import { View } from 'react-native';

export const ScreenTitle = ({
  title = '',
  loading = false,
}: {
  title?: string;
  loading?: boolean;
}) => {
  if (loading) return <Loading />;
  if (title)
    return (
      <View>
        <Stack.Screen options={{ title }} />
      </View>
    );
  return null;
};
