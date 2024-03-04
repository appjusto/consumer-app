import { DefaultText } from '@/common/components/texts/DefaultText';
import paddings from '@/common/styles/paddings';
import { OrderBusiness } from '@appjusto/types';
import { router } from 'expo-router';
import { Pressable, View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  business: OrderBusiness | undefined | null;
}

export const BusinessCartHeader = ({ business, style, ...props }: Props) => {
  // UI
  if (!business) return null;
  return (
    <View style={[{}, style]} {...props}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View>
          <DefaultText color="neutral700">Seu pedido em</DefaultText>
          <DefaultText style={{ marginTop: paddings.xs }} size="lg">
            {business.name}
          </DefaultText>
        </View>
        <Pressable
          onPress={() =>
            router.navigate({
              pathname: '/(logged)/(tabs)/(home)/r/[businessId]/',
              params: { businessId: business.id },
            })
          }
        >
          <DefaultText color="black">Adicionar itens</DefaultText>
        </Pressable>
      </View>
      {/* <HR style={{ marginVertical: paddings.xl }} /> */}
    </View>
  );
};
