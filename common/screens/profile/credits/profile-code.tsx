import { useContextApi } from '@/api/ApiContext';
import { useContextProfile } from '@/common/auth/AuthContext';
import { LinkButton } from '@/common/components/buttons/link/LinkButton';
import { DefaultInput } from '@/common/components/inputs/default/DefaultInput';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { useShowToast } from '@/common/components/views/toast/ToastContext';
import borders from '@/common/styles/borders';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import * as Clipboard from 'expo-clipboard';
import { Copy, FilePen } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Pressable, View, ViewProps } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

interface Props extends ViewProps {}

export const ProfileCode = ({ style, ...props }: Props) => {
  // context
  const api = useContextApi();
  const profile = useContextProfile();
  const showToast = useShowToast();
  // refs
  const codeRef = useRef<TextInput>(null);
  // state
  const [code, setCode] = useState('');
  const [editing, setEditing] = useState(false);
  // handlers
  const updateCodeHandler = () => {
    setEditing(false);
    api
      .profile()
      .updateCode(code.toUpperCase())
      .then(() => {
        showToast('Seu código foi atualizado com sucesso!', 'success');
      })
      .catch((error) => {
        const message =
          error instanceof Error ? error.message : 'Não foi possível atualizar seu código.';
        showToast(message, 'error');
      });
  };
  // UI
  if (!profile) return null;
  return (
    <View style={[{}, style]} {...props}>
      <View
        style={{
          marginTop: paddings.lg,
          padding: paddings.lg,
          backgroundColor: colors.primary100,
          ...borders.default,
          borderColor: colors.primary300,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View style={{ flex: 1 }}>
            <DefaultText size="xs">Seu código</DefaultText>
            {!editing ? (
              <Pressable
                onPress={() =>
                  Clipboard.setStringAsync(profile.code).then(() => {
                    showToast('Código copiado!', 'success');
                  })
                }
              >
                <DefaultText size="md" color="black">
                  {profile.code}
                </DefaultText>
              </Pressable>
            ) : (
              <DefaultInput
                ref={codeRef}
                placeholder="6 a 14 letras"
                value={code}
                maxLength={14}
                onChangeText={setCode}
                returnKeyType="done"
              />
            )}
          </View>

          {!editing ? (
            <View style={{ flexDirection: 'row' }}>
              <Pressable
                onPress={() =>
                  Clipboard.setStringAsync(profile.code).then(() => {
                    showToast('Código copiado!', 'success');
                  })
                }
              >
                <Copy size={24} color={colors.neutral900} />
              </Pressable>
              <Pressable
                onPress={() => {
                  setEditing(true);
                  codeRef.current?.focus();
                }}
              >
                <FilePen style={{ marginLeft: paddings.sm }} size={24} color={colors.neutral900} />
              </Pressable>
            </View>
          ) : null}
        </View>
        {editing ? (
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: paddings.lg }}
          >
            <LinkButton variant="ghost" onPress={() => setEditing(false)}>
              Cancelar
            </LinkButton>
            <LinkButton variant="ghost" onPress={updateCodeHandler}>
              Salvar
            </LinkButton>
          </View>
        ) : null}
      </View>
    </View>
  );
};
