import { useContextApi } from '@/api/ApiContext';
import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useCards } from '@/api/consumer/cards/useCards';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { useShowToast } from '@/common/components/views/toast/ToastContext';
import { PaymentCard } from '@/common/screens/orders/checkout/payment/cards/payment-card';
import { PaymentCardModal } from '@/common/screens/orders/checkout/payment/cards/payment-card-modal';
import { ScreenTitle } from '@/common/screens/title/screen-title';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Card, WithId } from '@appjusto/types';
import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

export default function ProfileCardListScreen() {
  // context
  const api = useContextApi();
  const showToast = useShowToast();
  // state
  const cards = useCards();
  const [optionsCard, setOptionsCard] = useState<WithId<Card>>();
  const [loading, setLoading] = useState(false);
  // tracking
  useTrackScreenView('Perfil: seus cartões');
  // handlers
  const addCardHandler = () => {
    router.push('/profile/cards/add');
  };
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
      .catch((error: unknown) => {
        setLoading(false);
        const message =
          error instanceof Error
            ? error.message
            : 'Não foi possível remover seu cartão. Tente novamente';
        showToast(message, 'error');
      });
  };
  // UI
  if (!cards) return <ScreenTitle title="Seus cartões" loading />;
  return (
    <View style={{ ...screens.default }}>
      <ScreenTitle title="Seus cartões" />
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
                  // router.navigate({
                  //   pathname: '/(logged)/(tabs)/profile/cards/[id]',
                  //   params: { id: card.id },
                  // })
                  setOptionsCard(card)
                }
                onSelectOptions={() => setOptionsCard(card)}
              />
            );
          })}
        </DefaultView>
      </DefaultScrollView>
      <View style={{ flex: 1 }} />
      <View style={{ padding: paddings.lg }}>
        <DefaultButton title="Adicionar cartão" onPress={addCardHandler} />
      </View>
    </View>
  );
}
