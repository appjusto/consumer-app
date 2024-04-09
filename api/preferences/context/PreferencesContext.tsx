import { useObserveLastPlace } from '@/api/consumer/places/useObserveLastPlace';
import { useTemporaryPlace } from '@/api/consumer/places/useTemporaryPlace';
import { useLocation } from '@/api/location/useLocation';
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
  updateLocationEnabled: (value: boolean) => void;
  location: LatLng;
}

const PreferencesContext = React.createContext<Value | undefined>(undefined);

export const PreferencesProvider = (props: Props) => {
  // state
  const lastPlace = useObserveLastPlace();
  const { temporaryPlace, setTemporaryPlace } = useTemporaryPlace();
  const { location, updateEnabled } = useLocation();
  // result
  const currentPlace = lastPlace ?? temporaryPlace;
  const currentLocation = currentPlace?.location ?? location;
  return (
    <PreferencesContext.Provider
      value={{
        currentPlace,
        temporaryPlace,
        setTemporaryPlace,
        updateLocationEnabled: updateEnabled,
        location: currentLocation,
      }}
    >
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
  return value.location;
};

export const useContextUpdateLocationEnabled = () => {
  const value = React.useContext(PreferencesContext);
  if (!value) throw new Error('Api fora de contexto.');
  return value.updateLocationEnabled;
};

export const useContextSetTemporaryPlace = () => {
  const value = React.useContext(PreferencesContext);
  if (!value) throw new Error('Api fora de contexto.');
  return value.setTemporaryPlace;
};
