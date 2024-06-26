import { CircledView } from '@/common/components/containers/CircledView';
import colors from '@/common/styles/colors';
import { Percent } from 'lucide-react-native';
import { ViewProps } from 'react-native';

interface Props extends ViewProps {
  size?: number;
}

export const DiscountIcon = ({ size = 18, style, ...props }: Props) => {
  return (
    <CircledView
      size={size}
      style={[{ backgroundColor: colors.primary500, borderColor: colors.primary500 }, style]}
      {...props}
    >
      <Percent size={size * 0.66} color={colors.primary100} />
    </CircledView>
  );
};
