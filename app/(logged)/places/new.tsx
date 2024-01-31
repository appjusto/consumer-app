import { useContextApi } from '@/api/ApiContext';
import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useLocation } from '@/api/location/useLocation';
import { addressHasNumber } from '@/api/maps/addressHasNumber';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { DefaultInput } from '@/common/components/inputs/default/DefaultInput';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { useDebounce } from '@/common/functions/useDebounce';
import colors from '@/common/styles/colors';
import lineHeight from '@/common/styles/lineHeight';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Address } from '@appjusto/types';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { MapPin } from 'lucide-react-native';
import { nanoid } from 'nanoid/non-secure';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Keyboard, Pressable, TextInput, View } from 'react-native';

export default function NewPlaceScreen() {
  // params
  const params = useLocalSearchParams<{ returnScreen: string }>();
  const returnScreen = params.returnScreen;
  // context
  const api = useContextApi();
  // refs
  const inputRef = useRef<TextInput>(null);
  const sessionTokenRef = useRef(nanoid());
  const sessionToken = sessionTokenRef.current;
  // state
  const { location } = useLocation();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>();
  // handlers
  const search = useCallback(
    (value: string) => {
      if (value.length < 3) {
        setAddresses(undefined);
        return;
      }
      setLoading(true);
      api
        .maps()
        .googlePlacesAutocomplete(value, sessionToken, location)
        .then(setAddresses)
        .finally(() => setLoading(false));
    },
    [api, location, sessionToken]
  );
  // side effects
  // search
  useDebounce(input, search);
  // focus
  useEffect(() => {
    // inputRef.current?.focus();
  }, []);
  // on select address
  const selectHandler = (address: Address) => {
    Keyboard.dismiss();
    router.push({
      pathname: addressHasNumber(address) ? '/places/confirm' : '/places/number',
      params: { sessionToken, returnScreen, ...address },
    });
  };
  // tracking
  useTrackScreenView('Novo endereço');
  // UI
  return (
    <DefaultScrollView style={{ ...screens.default }}>
      <Stack.Screen options={{ title: 'Novo endereço' }} />
      <DefaultView style={{ padding: paddings.lg }}>
        <DefaultText size="xl">De onde você está pedindo?</DefaultText>
        <DefaultInput
          ref={inputRef}
          style={{ marginTop: paddings.lg }}
          placeholder="Digite seu endereço"
          value={input}
          leftView={
            <MapPin style={{ marginRight: paddings.sm }} size={16} color={colors.neutral800} />
          }
          rightView={loading ? <ActivityIndicator size={16} color={colors.black} /> : null}
          returnKeyType="next"
          textAlign="left"
          onChangeText={setInput}
        />
        {addresses?.length ? (
          <View>
            {addresses.map((address, i) => (
              <View
                style={{
                  // borderWidth: 1,
                  minHeight: 70,
                  justifyContent: 'center',
                  borderBottomColor: colors.neutral50,
                  borderBottomWidth: 1,
                }}
                key={address.googlePlaceId ?? address.description}
              >
                <View
                  style={{
                    paddingVertical: paddings.md,
                    paddingHorizontal: paddings.lg,
                  }}
                >
                  <Pressable onPress={() => selectHandler(address)}>
                    {({ pressed }) => (
                      <View>
                        <DefaultText style={{ ...lineHeight.sm }} size="sm" color="black">
                          {address.main}
                        </DefaultText>
                        <DefaultText style={{ ...lineHeight.sm }} size="sm" color="neutral800">
                          {address.secondary}
                        </DefaultText>
                      </View>
                    )}
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        ) : addresses?.length === 0 ? (
          <View>{/* empty */}</View>
        ) : null}
      </DefaultView>
    </DefaultScrollView>
  );
}
