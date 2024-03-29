import { DefaultText } from '@/common/components/texts/DefaultText';
import paddings from '@/common/styles/paddings';
import { BusinessAlgolia } from '@appjusto/types';
import { View, ViewProps } from 'react-native';
import { AppJustoOnlyIcon } from '../icons/appjusto-only-icon';
import { BusinessLogo } from '../logo/business-logo';
import { BusinessBadges } from './item/business-badges';
import { BusinessItemInfo } from './item/business-info';

interface Props extends ViewProps {
  business: BusinessAlgolia;
  recyclingKey?: string;
}

export const BusinessListItem = ({ style, business, recyclingKey, ...props }: Props) => {
  const appjustoOnly = business.tags?.includes('appjusto-only');
  // UI
  return (
    <View
      style={{ flexDirection: 'row', alignItems: 'center', padding: paddings.sm, borderWidth: 0 }}
    >
      <BusinessLogo businessId={business.objectID} />
      <View style={{ marginLeft: paddings.md }}>
        {/* first line */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <DefaultText>{business.name}</DefaultText>
          {appjustoOnly ? <AppJustoOnlyIcon style={{ marginLeft: paddings.sm }} /> : null}
        </View>
        {/* second line */}
        <BusinessItemInfo style={{ marginTop: paddings.xs }} business={business} />
        {/* third line */}
        <BusinessBadges business={business} style={{ marginTop: paddings.xs }} />
      </View>
    </View>
  );
};
