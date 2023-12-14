import { useContextApi } from '@/api/ApiContext';
import { router, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { useContextProfile, useContextUser } from '../auth/AuthContext';

interface Props {
  children: React.ReactNode;
}

interface Value {}

const RoutesContext = React.createContext<Value>({});

export const RoutesProvider = (props: Props) => {
  // context
  const api = useContextApi();
  const isAnonymous = useContextUser()?.isAnonymous === true;
  const profile = useContextProfile();
  const segments = useSegments();
  // const restricted = segments[0] === '(logged)';
  const restricted = false;
  const situation = profile === null ? null : profile?.situation;
  console.log(segments);
  // side effects
  // routing
  useEffect(() => {
    console.log('routes', isAnonymous, situation);
    if (situation === undefined) return;
    if (isAnonymous) {
      if (restricted) router.replace('/sign-in');
    } else if (situation === 'approved') {
      router.replace('/(logged)/(tabs)/(home)/');
    } else if (situation === 'rejected') {
      router.replace('/rejected');
    } else if (situation === 'blocked') {
      router.replace('/blocked');
      // @ts-expect-error
    } else if (situation === 'blocked2') {
      router.replace('/blocked');
    }
  }, [isAnonymous, situation, restricted, api]);
  // result
  return <RoutesContext.Provider value={{}}>{props.children}</RoutesContext.Provider>;
};
