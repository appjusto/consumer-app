import { LatLng } from '@appjusto/types';
import { clearAlgoliaCache, getSearchIndex } from './client';
import { createFilters } from './createFilters';
import { SearchFilter, SearchKind, SearchOrder } from './types';

interface SearchOptions {
  kind: SearchKind;
  order: SearchOrder;
  filterArray: SearchFilter[] | undefined;
  aroundLatLng?: LatLng | null;
  query?: string;
  page?: number;
  hitsPerPage?: number;
}

export default class AlgoliaApi {
  async search<T>({
    kind,
    order,
    filterArray,
    aroundLatLng,
    query = '',
    page,
    hitsPerPage = 50,
  }: SearchOptions) {
    const index = getSearchIndex(kind, order);
    if (!index) throw new Error('Invalid index');
    const options =
      kind === 'fleet'
        ? { page, filters: 'type:public', hitsPerPage }
        : {
            aroundLatLng: aroundLatLng
              ? `${aroundLatLng.latitude}, ${aroundLatLng.longitude}`
              : undefined,
            minimumAroundRadius: 7000,
            filters: createFilters(kind, filterArray),
            page,
            hitsPerPage,
          };
    console.log(query, options);
    const result = await index.search<T>(query, options);
    return result;
  }

  clearCache() {
    return clearAlgoliaCache();
  }
}
