import { useEffect, useState } from 'react';
import { getDownloadURL } from './getDownloadURL';

export const useImageURL = (path?: string | null) => {
  // state
  const [url, setURL] = useState<string | null>();
  // side effects
  useEffect(() => {
    if (!path) {
      setURL(undefined);
      return;
    }
    getDownloadURL(path)
      .then(setURL)
      .catch((error) => {
        console.log(error);
        setURL(null);
      });
  }, [path]);
  return url;
};
