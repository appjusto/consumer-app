import { getBusinessAvailability } from '@/api/business/range/getBusinessAvailability';
import { useDistance } from '@/api/maps/distance/useDistance';
import { useContextGetServerTime } from '@/api/platform/context/platform-context';
import { useContextCurrentPlace } from '@/api/preferences/context/PreferencesContext';
import { SimpleBadge } from '@/common/components/badges/simple-badge';
import paddings from '@/common/styles/paddings';
import { BusinessAlgolia, PublicBusiness } from '@appjusto/types';
import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  business: BusinessAlgolia | PublicBusiness;
}

export const BusinessBadges = ({ business, style, ...props }: Props) => {
  // context
  const location = useContextCurrentPlace()?.location;
  const distance = useDistance(location, business?.businessAddress?.latlng);
  const getServerTime = useContextGetServerTime();
  // state
  const appjustoOnly = business.tags?.includes('appjusto-only');
  const isOutOfRange =
    distance !== undefined && business.deliveryRange && distance > business.deliveryRange;
  const availability = getBusinessAvailability(business, getServerTime());
  return (
    <View style={[{ flexDirection: 'row' }, style]} {...props}>
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
      {business.averageDiscount ? (
        <SimpleBadge variant="primary">{`${business.averageDiscount}% mais barato`}</SimpleBadge>
      ) : appjustoOnly ? (
        <SimpleBadge variant="primary">Só no appjusto</SimpleBadge>
      ) : null}
    </View>
  );
};
