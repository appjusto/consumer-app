import { EmptyIcon } from '@/common/components/modals/error/icon';
import { DefaultText } from '@/common/components/texts/DefaultText';
import paddings from '@/common/styles/paddings';
import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  text?: string;
}

export const EmptyList = ({
  text = 'Nenhum resultado com os filtros escolhidos',
  style,
  ...props
}: Props) => {
  return (
    <View
      style={[
        { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: paddings.xl },
        style,
      ]}
      {...props}
    >
      <EmptyIcon />
      <DefaultText style={{ marginTop: paddings.lg, textAlign: 'center' }} color="neutral800">
        {text}
      </DefaultText>
    </View>
  );
};
