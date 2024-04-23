import { useContextApi } from '@/api/ApiContext';
import { ConsumerProfile, WithId } from '@appjusto/types';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import React, { useEffect, useState } from 'react';
import { useUser } from './useUser';

const AuthContext = React.createContext<Value | undefined>(undefined);

interface Value {
  user: FirebaseAuthTypes.User | null | undefined;
  isAnonymous: boolean;
  userId: string | undefined;
  profile: WithId<ConsumerProfile> | undefined | null;
}

interface Props {
  children: React.ReactNode;
}

export const AuthProvider = (props: Props) => {
  // context
  const api = useContextApi();
  // state
  const user = useUser();
  const userId = user?.uid;
  const isAnonymous = user?.isAnonymous === true;
  const [profile, setProfile] = useState<WithId<ConsumerProfile> | null>();
  // console.log('userId', userId);
  // console.log('profile', profile);
  // side effects
  useEffect(() => {
    if (!userId) return;
    if (isAnonymous) {
      console.log('isAnonymous', userId);
      setProfile(null);
      return;
    }
    // inAppMessaging()
    //   .setMessagesDisplaySuppressed(false)
    //   .then(() => null);
    return api.profile().observeProfile(userId, setProfile);
  }, [api, userId, isAnonymous]);
  useEffect(() => {
    // console.log('user', user);
    if (user === null) {
      setProfile(null);
    }
  }, [user]);
  // result
  const value: Value = { user, userId, profile, isAnonymous };
  return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
};

export const useContextUser = () => {
  return React.useContext(AuthContext)?.user;
};

export const useContextUserLogged = () => {
  return Boolean(React.useContext(AuthContext)?.user?.uid);
};

export const useContextIsUserAnonymous = () => {
  return React.useContext(AuthContext)?.isAnonymous;
};

export const useContextUserId = () => {
  return React.useContext(AuthContext)?.userId;
};

export const useContextProfile = () => {
  return React.useContext(AuthContext)?.profile;
};
