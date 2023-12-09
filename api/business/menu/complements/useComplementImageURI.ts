import { Complement, WithId } from '@appjusto/types';
import storage from '@react-native-firebase/storage';
import { useEffect, useState } from 'react';
import { getComplementImageStoragePath } from '../../BusinessApi';

export const useComplementImageURI = (
  businessId: string | undefined,
  complement: WithId<Complement> | undefined
) => {
  // state
  const [url, setURL] = useState<string>();
  // side effects
  useEffect(() => {
    if (!businessId) return;
    if (!complement) return;
    if ('imageUrls' in complement && complement.imageUrls?.length) {
      setURL(complement.imageUrls.find(() => true)!);
    } else {
      storage()
        .ref(getComplementImageStoragePath(businessId, complement.id))
        .getDownloadURL()
        .then((url) => {
          if (url) setURL(url);
        })
        .catch(() => null);
    }
  }, [businessId, complement]);
  // result
  return url;
};
