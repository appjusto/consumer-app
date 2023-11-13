import { LatLng } from '@appjusto/types';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface Value {
  location?: LatLng;
}

const LocationContext = React.createContext<Value>({});

export const LocationProvider = (props: Props) => {
  // state
  // TODO: fix it
  const location: LatLng = { latitude: 0, longitude: 0 };
  // result
  return <LocationContext.Provider value={{ location }}>{props.children}</LocationContext.Provider>;
};

export const useContextLocation = () => {
  const value = React.useContext(LocationContext);
  if (!value) throw new Error('Api fora de contexto.');
  return value.location;
};
