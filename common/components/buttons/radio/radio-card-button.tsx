import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { Pressable, View, ViewProps } from 'react-native';
import { CircledView } from '../../containers/CircledView';

interface Props extends ViewProps {
  checked?: boolean;
  onPress?: () => void;
}

export const RadioCardButton = ({ checked, style, children, ...props }: Props) => {
  return (
    <Pressable
      style={[
        {
          padding: paddings.lg,
          backgroundColor: checked ? colors.primary100 : colors.white,
          borderColor: checked ? colors.primary500 : colors.neutral100,
          borderWidth: 1,
          borderRadius: 8,
        },
        style,
      ]}
      {...props}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View style={{ flex: 1 }}>{children}</View>
        {checked !== undefined ? (
          <CircledView
            size={18}
            style={{
              borderWidth: 1,
              borderColor: checked ? colors.primary900 : colors.neutral200,
              backgroundColor: colors.white,
            }}
          >
            <CircledView
              size={9}
              style={{
                borderWidth: 0,
                backgroundColor: checked ? colors.primary900 : colors.white,
              }}
            />
          </CircledView>
        ) : null}
      </View>
    </Pressable>
  );
};
