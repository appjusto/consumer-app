import { useTicketAuthURL } from '@/api/externals/ticket/useTicketAuthURL';
import { useContextProfile } from '@/common/auth/AuthContext';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { RoundedText } from '@/common/components/texts/RoundedText';
import { getNameInitials } from '@/common/profile/getNameInitials';
import { isProfileValid } from '@/common/profile/isProfileValid';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { Linking, Pressable, View } from 'react-native';

export default function ProfileHeader() {
  // context
  const profile = useContextProfile();
  const getTicketAuthUrl = useTicketAuthURL();
  // handlers
  const openTicketAuthUrl = () => {
    console.log(getTicketAuthUrl());
    Linking.openURL(getTicketAuthUrl()).catch((error) => {
      if (error) console.error(error);
    });
  };
  // UI
  if (!profile) return null;
  if (!isProfileValid(profile)) return null;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Pressable onPress={openTicketAuthUrl} delayLongPress={2000}>
        <RoundedText
          size="xl"
          color="primary500"
          style={{
            backgroundColor: colors.primary100,
            paddingVertical: paddings.lg,
            paddingHorizontal: paddings.lg,
          }}
        >
          {getNameInitials(profile)}
        </RoundedText>
      </Pressable>
      <DefaultText size="lg" style={{ marginLeft: paddings.md }}>
        {profile.name}
      </DefaultText>
    </View>
  );
}
