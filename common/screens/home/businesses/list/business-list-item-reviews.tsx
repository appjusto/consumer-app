import { DefaultText } from '@/common/components/texts/DefaultText';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { BusinessAlgolia } from '@appjusto/types';
import { ThumbsDown, ThumbsUp } from 'lucide-react-native';
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
    <View style={[{}, style]} {...props}>
      {isNew ? (
        <DefaultText size="xs" color="warning900">
          Novo
        </DefaultText>
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ThumbsUp size={14} color={colors.primary900} />
          <DefaultText style={{ marginLeft: paddings.xs, color: colors.primary900 }}>
            {positive}
          </DefaultText>
          <ThumbsDown style={{ marginLeft: paddings.xs }} size={14} color={colors.neutral700} />
          <DefaultText style={{ marginLeft: paddings.xs, color: colors.neutral700 }}>
            {negative}
          </DefaultText>
        </View>
      )}
    </View>
  );
};
