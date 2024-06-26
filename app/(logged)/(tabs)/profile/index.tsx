import { useContextApi } from '@/api/ApiContext';
import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useReferral } from '@/api/referral/useReferral';
import { useContextIsUserAnonymous, useContextProfile } from '@/common/auth/AuthContext';
import { DefaultBadge } from '@/common/components/badges/DefaultBadge';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultListItem } from '@/common/components/lists/DefaultListItem';
import { SingleListItem } from '@/common/components/lists/SingleListItem';
import { ConfirmModal } from '@/common/components/modals/confirm-modal';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { isProfileValid } from '@/common/profile/isProfileValid';
import ProfileHeader from '@/common/screens/profile/header/header';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { router, useFocusEffect } from 'expo-router';
import {
  BookMinus,
  ChevronRight,
  FileText,
  HelpCircle,
  LogOut,
  Settings,
  User2,
  Wallet,
} from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { Pressable, View } from 'react-native';

export default function ProfileScreen() {
  // context
  const api = useContextApi();
  const profile = useContextProfile();
  const isAnonymous = useContextIsUserAnonymous();
  // tracking
  useTrackScreenView('Sua conta');
  // state
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  // side effects
  useReferral();
  useFocusEffect(
    useCallback(() => {
      if (profile === null) router.navigate('/profile/sign-in');
    }, [profile])
  );
  // UI
  if (profile === null) return null;
  const showCards = !isAnonymous && isProfileValid(profile);
  return (
    <DefaultScrollView style={{ ...screens.default }}>
      <View style={{ ...screens.headless, padding: paddings.lg }}>
        <ConfirmModal
          visible={logoutModalVisible}
          text="Tem certeza que deseja sair?"
          cancelButtonLabel="Não, quero continuar logado"
          onConfirm={() => {
            setLogoutModalVisible(false);
            api.auth().signOut();
            router.replace('/welcome/');
          }}
          onCancel={() => setLogoutModalVisible(false)}
        />
        <ProfileHeader />
        <View style={{ flex: 1, marginTop: paddings.lg }}>
          <DefaultListItem
            title="Dados pessoais"
            subtitles={['Seu nome, e-mail, CPF, celular e data de nascimento']}
            leftView={<User2 size={20} color={colors.black} />}
            rightView={<ChevronRight size={16} color={colors.neutral800} />}
            onPress={() => router.navigate('/profile/personal')}
          />
          {showCards ? (
            <DefaultListItem
              title="Seus cartões"
              leftView={<BookMinus size={20} color={colors.black} />}
              rightView={<ChevronRight size={16} color={colors.neutral800} />}
              onPress={() => router.navigate('/profile/cards/list')}
            />
          ) : null}
          <DefaultListItem
            title="Seus créditos"
            subtitles={[
              'Compartilhe seu código e ganhe R$ 5 para cada pessoa que fizer um pedido pela primeira vez no appjusto',
            ]}
            leftView={<Wallet size={20} color={colors.black} />}
            rightView={
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <DefaultBadge
                  title="Novo"
                  color="success900"
                  backgroundColor="success100"
                  borderColor="success100"
                />
                <ChevronRight
                  style={{ marginLeft: paddings.sm }}
                  size={16}
                  color={colors.neutral800}
                />
              </View>
            }
            onPress={() => router.navigate('/profile/credits')}
          />

          <View style={{ flex: 1 }} />
          <SingleListItem
            title="Suporte"
            leftView={<HelpCircle color={colors.neutral700} size={20} />}
            rightView={<ChevronRight size={16} color={colors.neutral800} />}
            onPress={() => router.navigate('/profile/help/')}
          />
          <SingleListItem
            title="Configurações"
            leftView={<Settings color={colors.neutral700} size={20} />}
            rightView={<ChevronRight size={16} color={colors.neutral800} />}
            onPress={() => router.navigate('/profile/settings/')}
          />
          <SingleListItem
            title="Sobre o AppJusto"
            leftView={<FileText color={colors.neutral700} size={20} />}
            rightView={<ChevronRight size={16} color={colors.neutral800} />}
            onPress={() => router.navigate('/profile/about/')}
          />

          <Pressable onPress={() => setLogoutModalVisible(true)}>
            {({ pressed }) => (
              <View style={{ margin: paddings.lg, flexDirection: 'row' }}>
                <DefaultText color={pressed ? 'error500' : 'error900'}>Sair</DefaultText>
                <LogOut size={16} color={colors.error500} style={{ marginLeft: paddings.xs }} />
              </View>
            )}
          </Pressable>
        </View>
      </View>
    </DefaultScrollView>
  );
}
