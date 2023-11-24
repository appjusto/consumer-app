import { useContextApi } from '@/api/ApiContext';
import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useLocation } from '@/api/location/useLocation';
import { addressHasNumber } from '@/api/maps/addressHasNumber';
import { useContextUpdateTemporaryPlace } from '@/api/preferences/context/PreferencesContext';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { DefaultInput } from '@/common/components/inputs/default/DefaultInput';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { RoundedText } from '@/common/components/texts/RoundedText';
import { useDebounce } from '@/common/functions/useDebounce';
import colors from '@/common/styles/colors';
import lineHeight from '@/common/styles/lineHeight';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Address } from '@appjusto/types';
import { Stack, router } from 'expo-router';
import { MapPin, Plus } from 'lucide-react-native';
import { nanoid } from 'nanoid/non-secure';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Keyboard, Pressable, TextInput, View } from 'react-native';

export default function NewPlaceScreen() {
  // context
  const api = useContextApi();
  const updateTemporaryPlace = useContextUpdateTemporaryPlace();
  // refs
  const inputRef = useRef<TextInput>(null);
  const sessionToken = useRef(nanoid());
  // state
  const { location } = useLocation();
  const [input, setInput] = useState('');
  const [inputSelection, setInputSelection] = useState<{
    start: number;
    end?: number | undefined;
  }>();
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>();
  const [selectedAddress, setSelectedAddress] = useState<Address>();
  // handlers
  const search = useCallback(
    (value: string) => {
      if (value.length < 3) {
        setAddresses(undefined);
        return;
      }
      console.log('pesquisa por', value);
      setInputSelection(undefined);
      setLoading(true);
      api
        .maps()
        .googlePlacesAutocomplete(value, sessionToken.current, location)
        .then(setAddresses)
        .finally(() => setLoading(false));
    },
    [api, location]
  );
  // side effects
  useDebounce(input, search);
  useEffect(() => {
    if (!selectedAddress) return;
    Keyboard.dismiss();
    setInput(selectedAddress.description);
    updateTemporaryPlace({ address: selectedAddress });
    router.push('/places/confirm');
  }, [selectedAddress, updateTemporaryPlace]);
  // tracking
  useTrackScreenView('Novo endereço');
  // UI
  return (
    <DefaultScrollView style={{ ...screens.default }}>
      <Stack.Screen options={{ title: 'Novo endereço' }} />
      <DefaultView style={{ padding: paddings.lg }}>
        <DefaultText size="xl">De onde você está pedindo?</DefaultText>
        <DefaultInput
          selection={inputSelection}
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
                  <Pressable onPress={() => setSelectedAddress(address)}>
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
                  {!addressHasNumber(address) ? (
                    <Pressable
                      onPress={() => {
                        if (address.main) {
                          // setInput(address.description.replace(address.main, `${address.main} `));
                          setInput(address.description);
                          const location = address.main.length;
                          setInputSelection({ start: location });
                        }
                      }}
                    >
                      {({ pressed }) => (
                        <RoundedText
                          size="sm"
                          color="info900"
                          style={{
                            marginTop: paddings.sm,
                            borderColor: colors.info500,
                            borderWidth: 1,
                            paddingVertical: paddings.sm,
                          }}
                          leftView={
                            <Plus
                              style={{ marginRight: paddings.xs }}
                              size={12}
                              color={colors.info900}
                            />
                          }
                        >
                          Adicionar número
                        </RoundedText>
                      )}
                    </Pressable>
                  ) : null}
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
