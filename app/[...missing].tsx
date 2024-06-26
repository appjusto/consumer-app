import { Stack, router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { DefaultView } from '@/common/components/containers/DefaultView';
import { DefaultText } from '@/common/components/texts/DefaultText';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Tela não encontrada' }} />
      <DefaultView style={styles.container}>
        <DefaultText style={styles.title}>Tela não encontrada.</DefaultText>

        <Pressable onPress={() => router.back()}>
          <DefaultText style={styles.linkText}>Voltar</DefaultText>
        </Pressable>
      </DefaultView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
