import { DefaultText } from '@/common/components/texts/DefaultText';
import { formatCurrency } from '@/common/formatters/currency';
import { formatDistance } from '@/common/formatters/distance';
import borders from '@/common/styles/borders';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { Fleet, WithId } from '@appjusto/types';

import { trackEvent } from '@/api/analytics/track';
import { useContextOrderOptions } from '@/api/orders/context/order-context';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { OnlyIconButton } from '@/common/components/buttons/icon/OnlyIconButton';
import { router } from 'expo-router';
import { Share2 } from 'lucide-react-native';
import { View } from 'react-native';
import { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils';

interface Props extends ViewProps {
  fleet: WithId<Fleet>;
}

export const FleetCard = ({ fleet, style, ...props }: Props) => {
  // context
  const { setFleetsIds } = useContextOrderOptions()!;
  // handlers
  const selectFleet = () => {
    trackEvent('Escolheu frota', { fleetId: fleet.id });
    setFleetsIds([fleet.id]);
    router.back();
  };
  // UI
  const minimumFee = formatCurrency(fleet.minimumFee);
  const distanceThreshold = formatDistance(fleet.distanceThreshold);
  const additionalPerKmAfterThreshold = formatCurrency(fleet.additionalPerKmAfterThreshold);
  return (
    <View
      style={[{ padding: paddings.lg, ...borders.default, borderColor: colors.neutral200 }, style]}
      {...props}
    >
      <View>
        {/* header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {/* title */}
          <View>
            <DefaultText size="md">{fleet.name}</DefaultText>
            <DefaultText
              size="xs"
              color="success500"
              style={{ marginTop: paddings.xs }}
            >{`${fleet.participantsOnline} participantes online`}</DefaultText>
          </View>
          {/* share button */}
          <OnlyIconButton
            icon={<Share2 size={16} color={colors.neutral900} />}
            variant="circle"
            onPress={() => null}
          />
        </View>
        {/* description */}
        <DefaultText size="xs" style={{ marginTop: paddings.lg }}>
          {fleet.description}
        </DefaultText>
      </View>
      {/* details */}
      <View
        style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: paddings.lg }}
      >
        <View>
          <DefaultText size="xs" color="neutral700">
            Mínimo
          </DefaultText>
          <DefaultText size="md" color="black">
            {minimumFee}
          </DefaultText>
        </View>
        <View>
          <DefaultText size="xs" color="neutral700">
            Até
          </DefaultText>
          <DefaultText size="md" color="black">
            {distanceThreshold}
          </DefaultText>
        </View>
        <View>
          <DefaultText size="xs" color="neutral700">
            Adicional / KM
          </DefaultText>
          <DefaultText size="md" color="black">
            {additionalPerKmAfterThreshold}
          </DefaultText>
        </View>
      </View>
      {/* controls */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: paddings.lg,
          alignItems: 'center',
        }}
      >
        <DefaultButton
          style={{ flex: 1 }}
          title="Ver detalhes"
          variant="outline"
          onPress={() =>
            router.navigate({ pathname: '/(logged)/fleets/[id]', params: { id: fleet.id } })
          }
        />
        <DefaultButton
          style={{ flex: 1, marginLeft: paddings.lg }}
          title="Escolher frota"
          onPress={selectFleet}
        />
      </View>
    </View>
  );
};
