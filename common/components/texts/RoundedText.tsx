import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import typography, { semiboldFontFamily } from '@/common/styles/typography';
import { Text, View } from 'react-native';
import { DefaultTextProps } from './DefaultText';

interface Options extends DefaultTextProps {
  leftView?: React.ReactNode;
}

export function RoundedText({ leftView, style, color, size, bold, ...props }: Options) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: paddings.xs,
            paddingHorizontal: paddings.sm,
            borderRadius: 100,
          },
          style,
        ]}
      >
        {leftView}
        <Text
          style={[
            {
              ...typography[size ?? 'sm'],
              color: color ? colors[color] : colors.neutral900,
            },
            bold ? { fontFamily: semiboldFontFamily, fontWeight: 'bold' } : {},
          ]}
          {...props}
        />
      </View>
    </View>
  );
}
