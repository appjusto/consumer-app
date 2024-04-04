import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextUser } from '@/common/auth/AuthContext';
import { CircledView } from '@/common/components/containers/CircledView';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { MessageBox } from '@/common/components/views/MessageBox';
import borders from '@/common/styles/borders';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { router } from 'expo-router';
import { MapPin, XCircle } from 'lucide-react-native';
import { useEffect } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

const restrictions = [
  'Dinheiro, cheques e objetos de valor',
  'Objetos e substâncias ilícitas',
  'Armas de fogo e munição',
  'Materiais inflamáveis',
];

export default function P2PIndex() {
  // context
  const isAnonymous = useContextUser()?.isAnonymous === true;
  // tracking
  useTrackScreenView('Encomendas');
  // side effects
  useEffect(() => {
    if (isAnonymous) router.push('/sign-in');
  }, [isAnonymous]);
  // handlers
  const newOrderHandler = () => {
    router.navigate({ pathname: '/encomendas/new' });
  };
  // UI
  return (
    <DefaultScrollView style={{ ...screens.default }}>
      <DefaultView style={{ ...screens.headless, padding: paddings.lg }}>
        {/* header */}
        <View>
          <DefaultText size="xl">Enviar encomendas</DefaultText>
          <DefaultText style={{ marginTop: paddings.sm }} size="md" color="neutral800">
            Entregas imediatas ou agendadas
          </DefaultText>
        </View>
        {/* origin */}
        <Pressable onPress={newOrderHandler}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: paddings.lgg,
              paddingHorizontal: paddings.lg,
              paddingVertical: paddings.sm,
              borderColor: colors.neutral200,
              borderWidth: 1,
              borderRadius: 4,
            }}
          >
            <MapPin style={{ marginRight: paddings.sm }} size={16} color={colors.neutral700} />
            <DefaultText size="md" color="neutral700">
              De onde você quer enviar?
            </DefaultText>
          </View>
        </Pressable>
        {/* restrictions */}
        <MessageBox style={{ marginTop: paddings.lg }}>
          As medidas do pacote devem respeitar as dimensões e pesos máximos: 36cm de altura, 44cm de
          largura, 42cm de comprimento e 20kg de peso.
        </MessageBox>
        <View style={{ marginTop: paddings.xl }}>
          <DefaultText size="lg">Saiba o que não pode ser transportado</DefaultText>
          <DefaultText style={{ marginTop: paddings.sm }} size="md" color="neutral800">
            A pessoa que fará sua entrega pode levar o que couber no baú com a tampa fechada. Porém,
            existem exceções que não podem ser transportadas:
          </DefaultText>
          <ScrollView
            style={{ marginTop: paddings.lg }}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {restrictions.map((text) => (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: paddings.lg,
                  marginRight: paddings.lg,
                  ...borders.default,
                  borderColor: colors.neutral100,
                }}
                key={text}
              >
                <CircledView
                  style={{
                    marginRight: paddings.md,
                    backgroundColor: colors.error100,
                    borderColor: colors.error100,
                  }}
                  size={50}
                >
                  <XCircle size={24} color={colors.error900} />
                </CircledView>
                <DefaultText
                  style={{ flexWrap: 'wrap', maxWidth: 150 }}
                  size="sm"
                  color="black"
                  numberOfLines={2}
                >
                  {text}
                </DefaultText>
              </View>
            ))}
          </ScrollView>
        </View>
      </DefaultView>
    </DefaultScrollView>
  );
}
