import { useContextApi } from '@/api/ApiContext';
import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { getCardTypeByNumber } from '@/api/consumer/cards/card-type/getCardTypeByNumber';
import { CardInfo } from '@/api/consumer/cards/types';
import useAxiosCancelToken from '@/api/externals/useAxiosCancelToken';
import { useContextOrderPayments } from '@/api/orders/context/order-context';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { DefaultInput } from '@/common/components/inputs/default/DefaultInput';
import { PatternInput } from '@/common/components/inputs/pattern/PatternInput';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { HRShadow } from '@/common/components/views/hr-shadow';
import { useShowToast } from '@/common/components/views/toast/ToastContext';
import { CardsAccepted } from '@/common/screens/orders/checkout/payment/icons/cards-accepted';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { toNumber } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { TextInput, View } from 'react-native';

export default function CheckoutAddCardScreen() {
  // params
  const params = useLocalSearchParams<{ id: string }>();
  const businessId = params.id;
  // context
  const api = useContextApi();
  const showToast = useShowToast();
  const { setPaymentMethod, setPaymentMethodId } = useContextOrderPayments();
  // refs
  const validThruRef = useRef<TextInput>(null);
  const cvvRef = useRef<TextInput>(null);
  const nameRef = useRef<TextInput>(null);
  // state
  const [number, setNumber] = useState('');
  const [validThru, setValidThru] = useState('');
  const [cvv, setCVV] = useState('');
  const [name, setName] = useState('');
  const [card, setCard] = useState<CardInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const createCancelToken = useAxiosCancelToken();
  useEffect(() => {
    if (number.length !== 16) setCard(null);
    else if (validThru.length !== 4) setCard(null);
    else if (cvv.length !== 3) setCard(null);
    else if (name.split(' ').length < 2) setCard(null);
    else {
      const month = toNumber(validThru.substring(0, 2));
      const year = toNumber(validThru.substring(2));
      const fullYear = 2000 + year;
      const now = new Date();
      const thisYear = now.getFullYear();
      const thisMonth = now.getMonth() + 1;
      const type = getCardTypeByNumber(number);
      console.log(fullYear, thisYear, fullYear < thisYear, month, thisMonth, month < thisMonth);
      if (fullYear < thisYear) setCard(null);
      else if (fullYear === thisYear && month < thisMonth) setCard(null);
      else if (!type) setCard(null);
      else {
        const processor = type === 'vr-alimentação' || type === 'vr-refeição' ? 'vr' : 'iugu';
        setCard({
          processor,
          number,
          month: `${month}`,
          year: `20${year}`,
          cvv,
          name: name.trim(),
        });
      }
    }
  }, [number, validThru, cvv, name]);
  // tracking
  useTrackScreenView('Checkout: adicionar cartão');
  // handlers
  const saveCardHandler = async () => {
    if (!card) return;
    setLoading(true);
    api
      .consumers()
      .saveCard(card, createCancelToken())
      .then((cardId) => {
        console.log(cardId);
        setLoading(false);
        setPaymentMethod!('credit_card');
        setPaymentMethodId!(cardId);
        showToast('Pronto, cartão adicionado! ;)', 'success');
        router.push({
          pathname: '/(logged)/(tabs)/(home)/r/[id]/checkout/cards/add',
          params: { id: businessId },
        });
      })
      .catch((error) => {
        const message =
          error instanceof Error
            ? error.message
            : 'Não foi possível adicionar o cartão. Tente novamente.';
        showToast(message, 'error');
        setLoading(false);
      });
  };
  // UI
  return (
    <View style={{ ...screens.default }}>
      <Stack.Screen options={{ title: 'Adicionar cartão' }} />
      <DefaultScrollView>
        <DefaultView style={{ padding: paddings.lg }}>
          <DefaultText size="lg" color="neutral900">
            Preencha os dados do cartão
          </DefaultText>
          <View style={{ marginTop: paddings.lg }}>
            <DefaultText color="neutral700">Bandeiras aceitas</DefaultText>
            <CardsAccepted style={{ marginTop: paddings.sm }} />
          </View>
          <View style={{ marginTop: paddings.lg }}>
            <PatternInput
              pattern="creditcard16"
              title="Número do cartão"
              keyboardType="number-pad"
              value={number}
              onChangeText={setNumber}
              onSubmitEditing={() => validThruRef.current?.focus()}
            />
            <View
              style={{
                marginTop: paddings.lg,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <PatternInput
                ref={validThruRef}
                style={{ flex: 6 }}
                pattern="date"
                title="Data de validade"
                keyboardType="number-pad"
                value={validThru}
                onChangeText={setValidThru}
                onSubmitEditing={() => cvvRef.current?.focus()}
              />
              <PatternInput
                ref={cvvRef}
                style={{ marginLeft: paddings.lg, flex: 4 }}
                pattern="threedigtsnumber"
                title="CVV"
                keyboardType="number-pad"
                value={cvv}
                onChangeText={setCVV}
                onSubmitEditing={() => nameRef.current?.focus()}
              />
            </View>
            <DefaultInput
              ref={nameRef}
              style={{ marginTop: paddings.lg }}
              title="Nome do titular"
              placeholder="Conforme o cartão"
              value={name}
              keyboardType="default"
              returnKeyType="next"
              autoCapitalize="words"
              blurOnSubmit
              onChangeText={setName}
            />
          </View>
        </DefaultView>
      </DefaultScrollView>
      <View style={{ flex: 1 }} />
      <View>
        <HRShadow />
        <View style={{ padding: paddings.lg }}>
          <DefaultButton
            title="Salvar cartão"
            disabled={!card || loading}
            onPress={saveCardHandler}
          />
        </View>
      </View>
    </View>
  );
}
