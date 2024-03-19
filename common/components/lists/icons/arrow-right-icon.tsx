import borders from '@/common/styles/borders';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { ArrowRight } from 'lucide-react-native';
import { View } from 'react-native';

export const ArrowRightIcon = () => {
  return (
    <View
      style={{
        padding: paddings.sm,
        backgroundColor: colors.white,
        ...borders.white,
      }}
    >
      <ArrowRight size={16} color="black" />
    </View>
  );
};
