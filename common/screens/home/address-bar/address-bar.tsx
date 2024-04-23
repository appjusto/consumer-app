import { useContextCurrentPlace } from '@/api/preferences/context/PreferencesContext';
import { useContextIsUserAnonymous } from '@/common/auth/AuthContext';
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
  const isAnonymous = useContextIsUserAnonymous();
  // handlers
  const placesHandler = () =>
    isAnonymous
      ? router.navigate({ pathname: '/sign-in' })
      : router.navigate({ pathname: '/places' });
  // UI
  return (
    <Pressable onPress={placesHandler}>
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
          <MessageBox variant="warning">
            {`Usando sua localização aproximada. Clique para ${
              isAnonymous ? 'fazer login e ' : ''
            }definir seu endereço de entrega`}
          </MessageBox>
        )}
      </View>
    </Pressable>
  );
};
