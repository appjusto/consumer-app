import { useContextApi } from '@/api/ApiContext';
import { useObservePlaces } from '@/api/consumer/places/useObservePlaces';
import { Loading } from '@/common/components/views/Loading';
import paddings from '@/common/styles/paddings';
import { Place, WithId } from '@appjusto/types';
import { useState } from 'react';
import { View, ViewProps } from 'react-native';
import { PlaceListItem } from './places-list-item';
import { PlaceListItemModal } from './places-list-item-modal';

interface Props extends ViewProps {
  selectedId?: string;
  onSelect?: (place: WithId<Place>) => void;
}

export const PlacesList = ({ selectedId, onSelect, style, ...props }: Props) => {
  // context
  const api = useContextApi();
  // state
  const places = useObservePlaces();
  const [optionsPlace, setOptionsPlace] = useState<WithId<Place>>();
  // handlers
  const deleteHandler = () => {
    if (!optionsPlace) return;
    setOptionsPlace(undefined);
    api.consumers().deletePlace(optionsPlace);
  };
  // UI
  if (places === undefined) return <Loading />;
  return (
    <View style={[{}, style]} {...props}>
      <PlaceListItemModal
        place={optionsPlace}
        visible={Boolean(optionsPlace)}
        onDismiss={() => setOptionsPlace(undefined)}
        onDelete={deleteHandler}
        onEdit={() => {}}
      />

      {places.map((place, i) => (
        <PlaceListItem
          style={{ marginTop: paddings.lg }}
          place={place}
          checked={place.id === selectedId}
          key={place.id}
          onPress={() => {
            if (onSelect) onSelect(place);
            else setOptionsPlace(place);
          }}
          onSelectOptions={() => setOptionsPlace(place)}
        />
      ))}
    </View>
  );
};
