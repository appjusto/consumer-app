import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { View } from 'react-native';
import WebView from 'react-native-webview';

// const restrictions = [
//   'Dinheiro, cheques e objetos de valor',
//   'Objetos e substâncias ilícitas',
//   'Armas de fogo e munição',
//   'Materiais inflamáveis',
// ];

export default function P2PIndex() {
  // context
  // const isAnonymous = useContextIsUserAnonymous();
  // tracking
  useTrackScreenView('Encomendas');
  // side effects
  // useFocusEffect(
  //   useCallback(() => {
  //     if (isAnonymous) router.navigate('/encomendas/sign-in');
  //   }, [isAnonymous])
  // );
  // handlers
  // const newOrderHandler = () => {
  //   router.navigate({ pathname: '/encomendas/new' });
  // };
  // UI
  return (
    <View style={{ ...screens.default }}>
      <DefaultView style={screens.headless}>
        <WebView
          originWhitelist={['*']}
          source={{ uri: 'https://app-justo-staging.firebaseapp.com/' }}
          containerStyle={{
            backgroundColor: colors.white,
            paddingHorizontal: paddings.lg,
            paddingBottom: 20,
          }}
          style={{}}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />
      </DefaultView>

      {/*<DefaultScrollView style={{ ...screens.default }}>*/}
      {/* <DefaultView style={{ ...screens.headless, padding: paddings.lg }}> */}
      {/* header */}
      {/* <View>
          <DefaultText size="xl">Entregas rápidas</DefaultText>
          <DefaultText style={{ marginTop: paddings.sm }} size="md" color="neutral800">
            Entregas imediatas ou agendadas
          </DefaultText>
        </View> */}
      {/* origin */}
      {/* <Pressable onPress={newOrderHandler}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: paddings.lgg,
              marginBottom: paddings.lg,
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
        </Pressable> */}
      {/* ongoing */}
      {/* <OngoingOrders style={{ marginBottom: paddings.sm }} type="p2p" /> */}
      {/* restrictions */}
      {/* <MessageBox style={{}}>
          As medidas do pacote devem respeitar as dimensões e pesos máximos: 36cm de altura, 44cm de
          largura, 42cm de comprimento e 20kg de peso.
        </MessageBox> */}
      {/* <View style={{ marginTop: paddings.xl }}>
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
        </View> */}
      {/* </DefaultView> */}
      {/* </DefaultScrollView> */}
    </View>
  );
}
