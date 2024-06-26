import { useContextApi } from '@/api/ApiContext';
import { useRequestedProfileChanges } from '@/api/profile/useRequestedProfileChanges';
import { useContextProfile } from '@/common/auth/AuthContext';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { DefaultKeyboardAwareScrollView } from '@/common/components/containers/DefaultKeyboardAwareScrollView';
import { DefaultInput } from '@/common/components/inputs/default/DefaultInput';
import { PatternInput } from '@/common/components/inputs/pattern/PatternInput';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { Loading } from '@/common/components/views/Loading';
import { MessageBox } from '@/common/components/views/MessageBox';
import { useShowToast } from '@/common/components/views/toast/ToastContext';
import { handleErrorMessage } from '@/common/firebase/errors';
import { isProfileValid } from '@/common/profile/isProfileValid';
import paddings from '@/common/styles/paddings';
import { ProfileChange, UserProfile } from '@appjusto/types';
import * as cpfutils from '@fnando/cpf';
import crashlytics from '@react-native-firebase/crashlytics';
import { isEmpty, omit } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { SafeAreaView, TextInput, View } from 'react-native';
interface Props {
  onUpdateProfile?: () => void;
}

export default function ProfilePersonalData({ onUpdateProfile }: Props) {
  // context
  const api = useContextApi();
  const profile = useContextProfile();
  const profileValid = isProfileValid(profile);
  const showToast = useShowToast();
  // refs
  const nameRef = useRef<TextInput>(null);
  const surnameRef = useRef<TextInput>(null);
  const cpfRef = useRef<TextInput>(null);
  const birthdayRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  // state
  const pendingChange = useRequestedProfileChanges(profile?.id);
  const hasPendingChange = !isEmpty(omit(pendingChange ?? {}, ['company']));
  const [email, setEmail] = useState(api.auth().getEmail() ?? undefined);
  const [name, setName] = useState<string>();
  const [surname, setSurname] = useState<string>();
  const [cpf, setCpf] = useState<string>();
  const [phone, setPhone] = useState(api.auth().getPhoneNumber(true) ?? undefined);
  const [isLoading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  // helpers
  const countryCode = profile?.countryCode ?? '55';
  const updatedUser: Partial<UserProfile> = {
    email: (email ?? '').toLowerCase().trim(),
    name: (name ?? '').trim(),
    surname: (surname ?? '').trim(),
    cpf,
    phone,
    countryCode,
  };
  const editable = !hasPendingChange && (!profileValid || editing);
  // effects
  useEffect(() => {
    if (!profile) return;
    if (profile.email && email === undefined) setEmail(profile.email);
    if (profile.name && name === undefined) setName(profile.name);
    if (profile.surname && surname === undefined) setSurname(profile.surname);
    if (profile.cpf && cpf === undefined) setCpf(profile.cpf);
    if (profile.phone && phone === undefined) setPhone(profile.phone);
  }, [api, profile, email, name, surname, cpf, phone]);
  // handlers
  const handleError = (error: unknown) => {
    if (error instanceof Error) crashlytics().recordError(error);
    const message = handleErrorMessage(error);
    showToast(message, 'error');
    setLoading(false);
  };
  const updateProfileHandler = () => {
    if (!profile?.id) return;
    if (hasPendingChange) return;
    if (!editing && profileValid) {
      setEditing(true);
      return;
    }
    setLoading(true);
    if (!editing) {
      api
        .profile()
        .updateProfile(updatedUser)
        .then(() => {
          setLoading(false);
          if (onUpdateProfile) onUpdateProfile();
        })
        .catch((error) => {
          handleError(error);
        });
    } else {
      const changes: Partial<ProfileChange> = {
        accountId: profile.id,
      };
      if (name !== profile.name) changes.name = name;
      if (surname !== profile.surname) changes.surname = surname;
      if (cpf !== profile.cpf) changes.cpf = cpf;
      if (phone !== profile.phone) changes.phone = phone;
      if (isEmpty(changes)) {
        showToast('Nenhuma alteração solicitada.', 'warning');
        return;
      }
      api
        .profile()
        .requestProfileChange(changes)
        .then(() => {
          setLoading(false);
          setEditing(false);
          showToast('As alterações foram solicitadas com sucesso!', 'success');
        })
        .catch((error) => {
          handleError(error);
        });
    }
  };
  // UI
  const title = 'Dados pessoais';
  if (!profile) return <Loading backgroundColor="neutral50" title={title} />;
  return (
    <DefaultKeyboardAwareScrollView contentContainerStyle={{ padding: paddings.lg }}>
      <DefaultText size="lg">
        {profileValid
          ? 'Seus dados pessoais'
          : 'Preencha seus dados pessoais para fazer seu primeiro pedido'}
      </DefaultText>
      <DefaultInput
        style={{ marginTop: paddings.lg }}
        title="E-mail"
        placeholder="Digite seu e-mail"
        keyboardType="email-address"
        returnKeyType="next"
        autoCapitalize="none"
        value={email}
        editable={editable}
        blurOnSubmit={false}
        autoCorrect={false}
        onChangeText={setEmail}
        onSubmitEditing={() => nameRef.current?.focus()}
      />
      <DefaultInput
        ref={nameRef}
        style={{ marginTop: paddings.lg }}
        title="Nome"
        placeholder="Digite seu nome"
        value={name}
        keyboardType="default"
        returnKeyType="next"
        autoCapitalize="words"
        editable={editable}
        blurOnSubmit={false}
        onChangeText={setName}
        onSubmitEditing={() => surnameRef.current?.focus()}
      />
      <DefaultInput
        ref={surnameRef}
        style={{ marginTop: paddings.lg }}
        title="Sobrenome"
        placeholder="Digite seu sobrenome"
        value={surname}
        keyboardType="default"
        returnKeyType="next"
        autoCapitalize="words"
        editable={editable}
        blurOnSubmit={false}
        onChangeText={setSurname}
        onSubmitEditing={() => cpfRef.current?.focus()}
      />
      <View style={{ flexDirection: 'row', marginTop: paddings.lg }}>
        <PatternInput
          style={{ flex: 1 }}
          ref={cpfRef}
          pattern="cpf"
          title="CPF"
          placeholder="000.000.000-00"
          keyboardType="number-pad"
          returnKeyType="next"
          editable={editable}
          blurOnSubmit={false}
          value={cpf}
          onChangeText={setCpf}
          onSubmitEditing={() => birthdayRef.current?.focus()}
          error={cpf?.length === 11 && !cpfutils.isValid(cpf)}
        />
      </View>
      <SafeAreaView>
        <PatternInput
          ref={phoneRef}
          style={{ marginTop: paddings.lg }}
          pattern="phone"
          title="Celular"
          placeholder="Apenas números"
          keyboardType="number-pad"
          editable={editing}
          value={phone}
          onChangeText={setPhone}
        />
        {profileValid ? (
          <MessageBox style={{ marginTop: paddings.lg }}>
            {hasPendingChange
              ? 'Sua solicitação foi enviada para o nosso time e será revisada em breve.'
              : 'Alterações dos seus dados cadastrais precisarão ser revisadas pelo nosso time.'}
          </MessageBox>
        ) : null}
        <View style={{ flex: 1 }} />
        <DefaultButton
          style={{ marginTop: paddings.lg, marginBottom: paddings.xl }}
          title={profileValid ? (editing ? 'Salvar' : 'Atualizar dados') : 'Salvar e avançar'}
          disabled={isLoading || hasPendingChange || !isProfileValid(updatedUser)}
          onPress={updateProfileHandler}
        />
      </SafeAreaView>
    </DefaultKeyboardAwareScrollView>
  );
}
