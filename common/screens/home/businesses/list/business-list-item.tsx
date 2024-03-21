import { getBusinessAvailability } from '@/api/business/range/getBusinessAvailability';
import { useDistance } from '@/api/maps/distance/useDistance';
import { useContextGetServerTime } from '@/api/platform/context/platform-context';
import { useContextCurrentPlace } from '@/api/preferences/context/PreferencesContext';
import { SimpleBadge } from '@/common/components/badges/simple-badge';
import { DefaultText } from '@/common/components/texts/DefaultText';
import paddings from '@/common/styles/paddings';
import { BusinessAlgolia } from '@appjusto/types';
import { View, ViewProps } from 'react-native';
import { AppJustoOnlyIcon } from '../icons/appjusto-only-icon';
import { BusinessLogo } from '../logo/business-logo';
import { BusinessListItemReview } from './business-list-item-reviews';

interface Props extends ViewProps {
  item: BusinessAlgolia;
  recyclingKey?: string;
}

export const BusinessListItem = ({ style, item, recyclingKey, ...props }: Props) => {
  // context
  const getServerTime = useContextGetServerTime();
  // state
  const location = useContextCurrentPlace()?.location;
  const distance = useDistance(location, item?.businessAddress?.latlng);
  const distanceInKm = (() => {
    if (typeof distance !== 'number') return '';
    return `${distance === 0 ? 0 : (distance / 1000).toFixed(1)}km  •  `;
  })();
  const isOutOfRange =
    distance !== undefined && item.deliveryRange && distance > item.deliveryRange;
  const appjustoOnly = item.tags?.includes('appjusto-only');
  const cookingTime = item.averageCookingTime ? item.averageCookingTime / 60 : 40;
  const availability = getBusinessAvailability(item, getServerTime());
  // console.log(item.name, item.opened, availability);
  // UI
  return (
    <View
      style={{ flexDirection: 'row', alignItems: 'center', padding: paddings.sm, borderWidth: 0 }}
    >
      <BusinessLogo businessId={item.objectID} />
      <View style={{ marginLeft: paddings.md }}>
        {/* first line */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <DefaultText>{item.name}</DefaultText>
          {appjustoOnly ? <AppJustoOnlyIcon style={{ marginLeft: paddings.sm }} /> : null}
        </View>
        {/* second line */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: paddings.xs }}>
          <BusinessListItemReview item={item} />
          <DefaultText
            style={{ borderWidth: 0 }}
            color="neutral700"
            size="xs"
          >{`  •  ${item.cuisine}  •  ${distanceInKm}${cookingTime}min`}</DefaultText>
        </View>
        {/* third line */}
        <View style={{ flexDirection: 'row', marginTop: paddings.xs }}>
          {isOutOfRange ? (
            <SimpleBadge style={{ marginRight: paddings.sm }} variant="neutral">
              Fora do raio de entrega
            </SimpleBadge>
          ) : availability === 'schedule-required' ? (
            <SimpleBadge style={{ marginRight: paddings.sm }} variant="info">
              Só agendados
            </SimpleBadge>
          ) : availability === 'closed' ? (
            <SimpleBadge style={{ marginRight: paddings.sm }} variant="info">
              Fechado
            </SimpleBadge>
          ) : null}
          {item.averageDiscount ? (
            <SimpleBadge variant="primary">{`${item.averageDiscount}% de descconto`}</SimpleBadge>
          ) : appjustoOnly ? (
            <SimpleBadge variant="primary">Só no appjusto</SimpleBadge>
          ) : null}
        </View>
      </View>
    </View>
  );
};
