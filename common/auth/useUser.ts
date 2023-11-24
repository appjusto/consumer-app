import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';
import { useEffect, useState } from 'react';
import { useContextApi } from '../../api/ApiContext';

export const useUser = () => {
  // context
  const api = useContextApi();
  // state
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>();
  // side effects
  // once
  useEffect(() => {
    return api.auth().observeAuthState((value) => {
      if (value) setUser(value);
      else {
        api
          .auth()
          .signInAnonymously()
          .catch((error) => {
            if (error instanceof Error) crashlytics().recordError(error);
          });
      }
    });
  }, [api]);

  // result
  return user;
};
