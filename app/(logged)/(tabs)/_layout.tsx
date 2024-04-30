import { Link, Tabs } from 'expo-router';
import { Dimensions, Pressable, View, ViewProps, useColorScheme } from 'react-native';

import { DefaultText } from '@/common/components/texts/DefaultText';
import borders from '@/common/styles/borders';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import Colors from '@/common/styles/themes';
import { Home, InfoIcon, Package, Receipt, Users2 } from 'lucide-react-native';

interface TabIconProps extends ViewProps {
  focused?: boolean;
}

const HEIGHT = Dimensions.get('screen').width * Dimensions.get('screen').scale * 0.075;

const TabIcon = ({ focused, children, ...props }: TabIconProps) => (
  <View
    style={{
      width: 62,
      height: 36,
      ...borders.default,
      borderColor: focused ? colors.neutral100 : colors.white,
      backgroundColor: focused ? colors.neutral100 : colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: paddings.sm,
    }}
    {...props}
  >
    {children}
  </View>
);

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const activeColor = Colors[colorScheme ?? 'light'].tabIconSelected;
  const inactiveColor = Colors[colorScheme ?? 'light'].tabIconDefault;
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { height: HEIGHT },
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarLabel: ({ children }) => (
          <DefaultText style={{ marginBottom: paddings.sm }} size="xs">
            {children}
          </DefaultText>
        ),
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Restaurantes',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused}>
              <Home size={24} color={focused ? activeColor : inactiveColor} />
            </TabIcon>
          ),
          headerRight: () => (
            <Link href="/matching" asChild>
              <Pressable>
                {({ pressed }) => (
                  <InfoIcon
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="encomendas"
        options={{
          title: 'Entregas',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused}>
              <Package size={24} color={focused ? activeColor : inactiveColor} />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="order"
        options={{
          title: 'Pedidos',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused}>
              <Receipt size={24} color={focused ? activeColor : inactiveColor} />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Sua conta',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused}>
              <Users2 size={24} color={focused ? activeColor : inactiveColor} />
            </TabIcon>
          ),
        }}
      />
    </Tabs>
  );
}
