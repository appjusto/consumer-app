import { DefaultText } from '@/common/components/texts/DefaultText';
import { RoundedText } from '@/common/components/texts/RoundedText';
import paddings from '@/common/styles/paddings';
import { BusinessAlgolia } from '@appjusto/types';
import { View, ViewProps } from 'react-native';
import { BusinessLogo } from '../logo/business-logo';
import { BusinessListItemReview } from './business-list-item-reviews';

interface Props extends ViewProps {
  item: BusinessAlgolia;
  recyclingKey?: string;
}

export const BusinessListItem = ({ style, item, recyclingKey, ...props }: Props) => {
  // UI
  return (
    <View style={{ flexDirection: 'row', padding: paddings.sm }}>
      <BusinessLogo businessId={item.objectID} />
      <View style={{ marginLeft: paddings.sm }}>
        <DefaultText>{item.name}</DefaultText>
        <View style={{ flexDirection: 'row', marginTop: paddings.xs }}>
          <BusinessListItemReview item={item} />
        </View>
        {item.averageDiscount ? (
          <RoundedText>{`${item.averageDiscount}% de descconto`}</RoundedText>
        ) : null}
      </View>
    </View>
  );
};
