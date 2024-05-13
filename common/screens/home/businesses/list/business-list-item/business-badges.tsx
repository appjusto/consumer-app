import { getBusinessAvailability } from '@/api/business/range/getBusinessAvailability';
import { useDistance } from '@/api/maps/distance/useDistance';
import { useContextGetServerTime } from '@/api/platform/context/platform-context';
import { useContextCurrentPlace } from '@/api/preferences/context/PreferencesContext';
import { SimpleBadge } from '@/common/components/badges/simple-badge';
import paddings from '@/common/styles/paddings';
import { BusinessAlgolia, PublicBusiness } from '@appjusto/types';
import { StyleSheet, View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  business: BusinessAlgolia | PublicBusiness;
}

const defaultStyle = StyleSheet.create({
  badge: {
    marginRight: paddings.sm,
    marginBottom: paddings.sm,
  },
});

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
    <View style={[{ flexDirection: 'row', flexWrap: 'wrap' }, style]} {...props}>
      {isOutOfRange ? (
        <SimpleBadge style={defaultStyle.badge} variant="neutral">
          Fora do raio de entrega
        </SimpleBadge>
      ) : availability === 'schedule-required' ? (
        <SimpleBadge style={defaultStyle.badge} variant="info">
          Só agendados
        </SimpleBadge>
      ) : availability === 'closed' ? (
        <SimpleBadge style={defaultStyle.badge} variant="info">
          Fechado
        </SimpleBadge>
      ) : null}
      {appjustoOnly ? (
        <SimpleBadge variant="primary" style={defaultStyle.badge}>
          Só no appjusto
        </SimpleBadge>
      ) : business.averageDiscount ? (
        <SimpleBadge
          variant="primary"
          style={defaultStyle.badge}
        >{`${business.averageDiscount}% mais barato`}</SimpleBadge>
      ) : null}
      {'coupons' in business && business.coupons ? (
        <SimpleBadge variant="primary">Cupom disponível</SimpleBadge>
      ) : null}
    </View>
  );
};
