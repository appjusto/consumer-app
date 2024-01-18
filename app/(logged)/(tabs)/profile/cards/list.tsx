import { useContextApi } from '@/api/ApiContext';
import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useCards } from '@/api/consumer/cards/useCards';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { Loading } from '@/common/components/views/Loading';
import { PaymentCard } from '@/common/screens/orders/checkout/payment/cards/payment-card';
import { PaymentCardModal } from '@/common/screens/orders/checkout/payment/cards/payment-card-modal';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Card, WithId } from '@appjusto/types';
import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

export default function ProfileCardListScreen() {
  // context
  const api = useContextApi();
  // state
  const cards = useCards();
  const [optionsCard, setOptionsCard] = useState<WithId<Card>>();
  const [loading, setLoading] = useState(false);
  // tracking
  useTrackScreenView('Perfil: seus cartões');
  // handlers
  const deleteCardHandler = () => {
    if (!optionsCard) return;
    if (loading) return;
    setLoading(true);
    api
      .consumers()
      .deleteCard(optionsCard.id)
      .then(() => {
        setLoading(false);
        setOptionsCard(undefined);
      })
      .catch((error) => {
        setLoading(false);
      });
  };
  // UI
  if (!cards) return <Loading />;
  return (
    <View style={{ ...screens.default }}>
      <Stack.Screen options={{ title: 'Seus cartões' }} />
      <PaymentCardModal
        card={optionsCard}
        visible={Boolean(optionsCard)}
        loading={loading}
        onDismiss={() => {
          if (!loading) setOptionsCard(undefined);
        }}
        onDelete={deleteCardHandler}
        onView={() => {}}
      />
      <DefaultScrollView>
        <DefaultView style={{ padding: paddings.lg }}>
          {cards.map((card) => {
            return (
              <PaymentCard
                style={{ marginTop: paddings.lg }}
                card={card}
                key={card.id}
                onPress={() =>
                  router.push({
                    pathname: '/(logged)/(tabs)/profile/cards/[id]',
                    params: { id: card.id },
                  })
                }
                onSelectOptions={() => setOptionsCard(card)}
              />
            );
          })}
        </DefaultView>
      </DefaultScrollView>
      <View style={{ flex: 1 }} />
      <View style={{ padding: paddings.lg }}>
        <DefaultButton
          title="Adicionar cartão"
          onPress={() => {
            // TODO: /cards/add
          }}
        />
      </View>
    </View>
  );
}
