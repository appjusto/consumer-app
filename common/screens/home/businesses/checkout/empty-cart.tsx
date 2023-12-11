import { EmptyIcon } from '@/common/components/modals/error/icon';
import { DefaultText } from '@/common/components/texts/DefaultText';
import lineHeight from '@/common/styles/lineHeight';
import paddings from '@/common/styles/paddings';
import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {}

export const EmptyCart = ({ style, ...props }: Props) => {
  // UI
  return (
    <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center' }, style]} {...props}>
      <EmptyIcon />
      <DefaultText style={{ marginTop: paddings.lg }} size="lg" color="neutral800">
        Sua sacola está vazia
      </DefaultText>
      <DefaultText
        style={{ margin: paddings.xl, ...lineHeight.md, textAlign: 'center' }}
        size="md"
        color="neutral800"
      >
        Continue navegando para adicionar itens na sua sacola!
      </DefaultText>
    </View>
  );
};
