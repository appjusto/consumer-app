import { RoundedToggleButton } from '@/common/components/buttons/toggle/rounded-toggle-button';
import { RoundedText } from '@/common/components/texts/RoundedText';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { Filter } from 'lucide-react-native';
import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  total: number;
  onPress: () => void;
}

export const FiltersButton = ({ total, onPress, ...props }: Props) => {
  return (
    <RoundedToggleButton
      title="Filtros"
      toggled={false}
      onPress={onPress}
      rightView={
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {total > 0 ? (
            <RoundedText
              style={{
                marginLeft: paddings.sm,
                backgroundColor: colors.primary100,
                borderColor: colors.primary900,
              }}
              size="xxs"
              color="primary900"
            >
              {total}
            </RoundedText>
          ) : null}
          <Filter style={{ marginLeft: paddings.sm }} size={16} color={colors.neutral900} />
        </View>
      }
      {...props}
    />
  );
};
