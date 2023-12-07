import { DefaultText } from '@/common/components/texts/DefaultText';
import colors from '@/common/styles/colors';
import { BusinessAlgolia } from '@appjusto/types';
import { Star } from 'lucide-react-native';
import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  item: BusinessAlgolia;
}

export const BusinessListItemReview = ({ item, style, ...props }: Props) => {
  const positive = item.reviews?.positiveReviews ?? 0;
  const negative = item.reviews?.negativeReviews ?? 0;
  const isNew = positive + negative < 5;
  // UI
  return (
    <View style={[{ flexDirection: 'row' }, style]} {...props}>
      <Star color={colors.warning500} size={14} fill={colors.warning500} />
      <DefaultText size="xs" color="warning900">
        {isNew ? 'Novo' : ''}
      </DefaultText>
    </View>
  );
};
