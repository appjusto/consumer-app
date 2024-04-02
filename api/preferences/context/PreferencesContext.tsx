import { useObserveLastPlace } from '@/api/consumer/places/useObserveLastPlace';
import { useTemporaryPlace } from '@/api/consumer/places/useTemporaryPlace';
import { Place, WithId } from '@appjusto/types';
import React from 'react';
import { LatLng } from 'react-native-maps';
interface Props {
  children: React.ReactNode;
}

interface Value {
  currentPlace: WithId<Place> | Partial<Place> | null | undefined;
  temporaryPlace: Partial<Place> | null | undefined;
  setTemporaryPlace: (place: Partial<Place> | null) => void;
}

const PreferencesContext = React.createContext<Value | undefined>(undefined);

const DEFAULT_LOCATION: LatLng = { latitude: -23.541516, longitude: -46.655214 };

export const PreferencesProvider = (props: Props) => {
  // state
  const lastPlace = useObserveLastPlace();
  const { temporaryPlace, setTemporaryPlace } = useTemporaryPlace();
  const currentPlace = lastPlace ?? temporaryPlace;
  // result
  return (
    <PreferencesContext.Provider value={{ currentPlace, temporaryPlace, setTemporaryPlace }}>
      {props.children}
    </PreferencesContext.Provider>
  );
};

export const useContextCurrentPlace = () => {
  const value = React.useContext(PreferencesContext);
  if (!value) throw new Error('Api fora de contexto.');
  return value.currentPlace;
};

export const useContextCurrentLocation = () => {
  const value = React.useContext(PreferencesContext);
  if (!value) throw new Error('Api fora de contexto.');
  return value.currentPlace?.location ?? DEFAULT_LOCATION;
};

export const useContextTemporaryPlace = () => {
  const value = React.useContext(PreferencesContext);
  if (!value) throw new Error('Api fora de contexto.');
  return value.temporaryPlace;
};

export const useContextSetTemporaryPlace = () => {
  const value = React.useContext(PreferencesContext);
  if (!value) throw new Error('Api fora de contexto.');
  return value.setTemporaryPlace;
};
