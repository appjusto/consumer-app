import { useContextCurrentPlace } from '@/api/preferences/context/PreferencesContext';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { MessageBox } from '@/common/components/views/MessageBox';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { router } from 'expo-router';
import { ChevronDown } from 'lucide-react-native';
import { Pressable, View, ViewProps } from 'react-native';

interface Props extends ViewProps {}

export const AdreessBar = ({ style, ...props }: Props) => {
  // context
  const currentPlace = useContextCurrentPlace();
  // if (!currentPlace) return null;
  // UI
  return (
    <Pressable onPress={() => router.push('/places')}>
      <View
        style={[
          {
            padding: paddings.lg,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.neutral50,
          },
          style,
        ]}
        {...props}
      >
        {currentPlace ? (
          <>
            <DefaultText style={{ textAlign: 'center' }} color="black">
              {currentPlace.address?.main ?? ''}
            </DefaultText>
            <ChevronDown style={{ marginLeft: paddings.sm }} color={colors.black} size={16} />
          </>
        ) : (
          <Pressable onPress={() => router.navigate({ pathname: '/places/new' })}>
            <MessageBox variant="warning">
              Usando sua localização aproximada. Faça login ou clique para definir o endereço de
              entrega
            </MessageBox>
          </Pressable>
        )}
      </View>
    </Pressable>
  );
};
