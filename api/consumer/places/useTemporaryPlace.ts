import { Place } from '@appjusto/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const KEY = 'temporary-place';

// AsyncStorage.clear().then(() => null);

const retrieve = async () => {
  try {
    const value = await AsyncStorage.getItem(KEY);
    if (value) {
      return JSON.parse(value) as Partial<Place>;
    }
  } catch (error: unknown) {
    console.info(error);
  }
  return null;
};

const store = async (place: Partial<Place>) => {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(place));
  } catch (error: unknown) {
    console.info(error);
  }
};

export const useTemporaryPlace = () => {
  // handlers
  const [temporaryPlace, setTemporaryPlace] = useState<Partial<Place> | null>();
  // side effects
  useEffect(() => {
    retrieve().then(setTemporaryPlace);
  }, []);
  // result
  const updateTemporaryPlace = useCallback((place: Partial<Place>) => {
    store(place);
    setTemporaryPlace(place);
  }, []);
  return { temporaryPlace, updateTemporaryPlace };
};
