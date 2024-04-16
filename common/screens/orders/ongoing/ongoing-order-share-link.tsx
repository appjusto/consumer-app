import { getOrderShareLink } from '@/api/orders/share/getOrderShareLink';
import { SimpleBadge } from '@/common/components/badges/simple-badge';
import { LinkButton } from '@/common/components/buttons/link/LinkButton';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { useShowToast } from '@/common/components/views/toast/ToastContext';
import borders from '@/common/styles/borders';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { Order, WithId } from '@appjusto/types';
import * as Clipboard from 'expo-clipboard';
import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  order: WithId<Order>;
}

export const OngoingOrderShareLink = ({ order, style, ...props }: Props) => {
  // context
  const showToast = useShowToast();
  // handlers
  const copyLinkHandler = () => {
    Clipboard.setStringAsync(getOrderShareLink(order)).then(() => {
      showToast('Link de compartilhamento copiado com sucesso!', 'success');
    });
  };
  // UI
  return (
    <View
      style={[
        {
          paddingHorizontal: paddings.lg,
          paddingVertical: paddings.lgg,
          marginBottom: paddings.lg,
          backgroundColor: colors.white,
          ...borders.light,
        },
        style,
      ]}
      {...props}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <DefaultText>Link de compartilhamento</DefaultText>
        <SimpleBadge style={{ marginLeft: paddings.lg }} variant="info">
          Novo
        </SimpleBadge>
      </View>
      <DefaultText style={{ marginTop: paddings.sm }} size="md" color="black">
        Compartilhe apenas com quem for receber o pedido
      </DefaultText>
      <LinkButton style={{ alignSelf: 'center' }} variant="ghost" onPress={copyLinkHandler}>
        Copiar link
      </LinkButton>
    </View>
  );
};
