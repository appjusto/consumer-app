import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useAlgoliaSearch } from '@/api/externals/algolia/useAlgoliaSearch';
import { DefaultInput } from '@/common/components/inputs/default/DefaultInput';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { Loading } from '@/common/components/views/Loading';
import { FleetCard } from '@/common/screens/fleets/fleet-card';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Fleet } from '@appjusto/types';
import { FlashList } from '@shopify/flash-list';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

export default function FleetsSearch() {
  // state
  const [fleetName, setFleetName] = useState('');
  const { results: fleets, isLoading } = useAlgoliaSearch<Fleet>(
    true,
    'fleet',
    'distance',
    undefined,
    undefined,
    fleetName
  );
  // tracking
  useTrackScreenView('Frotas disponíveis');
  // UI
  const title = 'Frotas disponíveis';
  if (!fleets) return <Loading title={title} />;
  return (
    <View style={{ ...screens.default, padding: paddings.lg }}>
      <Stack.Screen options={{ title }} />
      <DefaultText size="lg">Frotas disponíveis</DefaultText>
      <DefaultText style={{ marginTop: paddings.lg }} color="neutral700">
        Você pode escolher a frota que vai fazer a sua entrega.{' '}
        <DefaultText style={{ marginTop: paddings.lg }} color="neutral700" bold>
          O número de participantes online indica quantas pessoas da frota estão disponíveis agora.
        </DefaultText>
      </DefaultText>
      <DefaultInput
        style={{ marginTop: paddings.lg }}
        title="Pesquisa pelo nome"
        placeholder="Frota"
        value={fleetName}
        keyboardType="default"
        returnKeyType="next"
        blurOnSubmit={false}
        onChangeText={setFleetName}
      />
      <View style={{ height: paddings.xl }} />
      <FlashList
        data={fleets}
        renderItem={({ item }) => {
          return (
            <Pressable
              onPress={() => {
                // TODO
              }}
            >
              <FleetCard style={{ marginBottom: paddings.lg }} fleet={item} />
            </Pressable>
          );
        }}
        keyExtractor={(item) => item.id}
        estimatedItemSize={460}
        ListFooterComponent={<View style={{ height: paddings.lg }} />}
      />
    </View>
  );
}
