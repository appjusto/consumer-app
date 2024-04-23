import { useContextApi } from '@/api/ApiContext';
import { router, useSegments } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Linking } from 'react-native';
import { useContextProfile } from '../auth/AuthContext';
import { processURL } from '../deeplink/processURL';
import {
  useContextDeeplink,
  useContextSetDeeplink,
} from '../notifications/context/NotificationContext';
import { useNotifications } from '../notifications/useNotifications';

interface Props {
  children: React.ReactNode;
}

interface Value {}

const RoutesContext = React.createContext<Value>({});

export const RoutesProvider = (props: Props) => {
  // context
  const api = useContextApi();
  const deeplink = useContextDeeplink();
  const setDeeplink = useContextSetDeeplink();
  const profile = useContextProfile();
  const segments = useSegments();
  const situation = profile === null ? null : profile?.situation;
  // state
  const [bootstrapped, setBootstrapped] = useState(false);
  // side effects
  useNotifications();
  // deeplink fix https://github.com/expo/router/issues/818
  useEffect(() => {
    Linking.addEventListener('url', ({ url }) => {
      // console.log('Linking', url, processURL(url));
      setDeeplink(processURL(url));
    });
  }, [setDeeplink]);
  // notifications deeplink
  useEffect(() => {
    if (!bootstrapped) return;
    if (!deeplink) return;
    router.navigate(deeplink);
    setDeeplink(undefined);
  }, [bootstrapped, deeplink, setDeeplink]);
  // routing
  useEffect(() => {
    // ShowToast(segments.join('/'));
  }, [segments]);
  useEffect(() => {
    // console.log('routes', isAnonymous, situation);
    if (situation === undefined) return;
    if (situation === 'approved') {
      if (!bootstrapped) {
        router.replace('/(logged)/(tabs)/(home)/');
        setBootstrapped(true);
      }
    } else if (situation === 'rejected') {
      router.replace('/rejected');
    } else if (situation === 'blocked') {
      router.replace('/blocked');
      // @ts-expect-error
    } else if (situation === 'blocked2') {
      router.replace('/blocked');
    }
  }, [situation, api, bootstrapped]);
  // logs
  console.log(segments);
  // result
  return <RoutesContext.Provider value={{}}>{props.children}</RoutesContext.Provider>;
};
