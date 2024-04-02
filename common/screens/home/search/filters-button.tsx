import { RoundedToggleButton } from '@/common/components/buttons/toggle/rounded-toggle-button';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { Filter } from 'lucide-react-native';
import { ViewProps } from 'react-native';

interface Props extends ViewProps {
  onPress: () => void;
}

export const FiltersButton = ({ onPress, ...props }: Props) => {
  return (
    <RoundedToggleButton
      title="Filtros"
      toggled={false}
      onPress={onPress}
      rightView={<Filter style={{ marginLeft: paddings.sm }} size={16} color={colors.neutral900} />}
      {...props}
    />
  );
};
