import { ViewProps } from 'react-native';
import { HR } from './HR';

interface Props extends ViewProps {}

export const HRShadow = ({ style, ...props }: Props) => {
  return (
    <HR
      style={[
        {
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.22,
          shadowRadius: 2.22,
          elevation: 3,
        },
        style,
      ]}
      {...props}
    />
  );
};
