import colors, { ColorName } from '@/common/styles/colors';
import screens from '@/common/styles/screens';
import { Stack } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import { DefaultView } from '../containers/DefaultView';

interface Props {
  color?: ColorName;
  backgroundColor?: ColorName;
  title?: string;
  size?: number | 'small' | 'large' | undefined;
}

export function Loading({ color, backgroundColor, title, size = 'large' }: Props) {
  return (
    <DefaultView
      style={{
        ...screens.default,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors[backgroundColor ?? 'white'],
      }}
    >
      {title ? <Stack.Screen options={{ title }} /> : null}
      <ActivityIndicator size={size} color={color ? colors[color] : colors.primary900} />
    </DefaultView>
  );
}
