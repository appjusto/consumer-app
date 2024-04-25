import { Loading } from '@/common/components/views/Loading';
import { Stack } from 'expo-router';

export const ScreenTitle = ({
  title = '',
  loading = false,
}: {
  title?: string;
  loading?: boolean;
}) => (
  <>
    <Stack.Screen options={{ title }} />
    {loading ? <Loading /> : null}
  </>
);
