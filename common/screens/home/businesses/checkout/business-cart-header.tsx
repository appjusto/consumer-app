import { DefaultText } from '@/common/components/texts/DefaultText';
import paddings from '@/common/styles/paddings';
import { OrderBusiness } from '@appjusto/types';
import { router } from 'expo-router';
import { Pressable, View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  business: OrderBusiness;
}

export const BusinessCartHeader = ({ business, style, ...props }: Props) => {
  // UI
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: paddings.lg,
        },
        style,
      ]}
      {...props}
    >
      <View>
        <DefaultText color="neutral700">Seu pedido em</DefaultText>
        <DefaultText size="lg">{business.name}</DefaultText>
      </View>
      <Pressable
        onPress={() =>
          router.push({
            pathname: '/(logged)/(tabs)/(home)/r/[id]/',
            params: { id: business.id },
          })
        }
      >
        <DefaultText color="black">Adicionar itens</DefaultText>
      </Pressable>
    </View>
  );
};
