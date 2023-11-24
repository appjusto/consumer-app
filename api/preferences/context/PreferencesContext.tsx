import { useFetchLastPlace } from '@/api/consumer/places/useFetchLastPlace';
import { useTemporaryPlace } from '@/api/consumer/places/useTemporaryPlace';
import { Place, WithId } from '@appjusto/types';
import React from 'react';
interface Props {
  children: React.ReactNode;
}

interface Value {
  currentPlace: WithId<Place> | Partial<Place> | null | undefined;
  temporaryPlace: Partial<Place> | null | undefined;
  updateTemporaryPlace: (place: Partial<Place>) => void;
}

const PreferencesContext = React.createContext<Value | undefined>(undefined);

export const PreferencesProvider = (props: Props) => {
  // state
  const lastPlace = useFetchLastPlace();
  const { temporaryPlace, updateTemporaryPlace } = useTemporaryPlace(!lastPlace);
  const currentPlace = lastPlace || temporaryPlace;
  // result
  return (
    <PreferencesContext.Provider value={{ currentPlace, temporaryPlace, updateTemporaryPlace }}>
      {props.children}
    </PreferencesContext.Provider>
  );
};

export const useContextCurrentPlace = () => {
  const value = React.useContext(PreferencesContext);
  if (!value) throw new Error('Api fora de contexto.');
  return value.currentPlace;
};

export const useContextTemporaryPlace = () => {
  const value = React.useContext(PreferencesContext);
  if (!value) throw new Error('Api fora de contexto.');
  return value.temporaryPlace;
};

export const useContextUpdateTemporaryPlace = () => {
  const value = React.useContext(PreferencesContext);
  if (!value) throw new Error('Api fora de contexto.');
  return value.updateTemporaryPlace;
};
