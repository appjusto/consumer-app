import { useDebounce } from '@/common/functions/useDebounce';
import { SearchResponse } from '@algolia/client-search';
import { LatLng } from '@appjusto/types';
import crashlytics from '@react-native-firebase/crashlytics';
import { useCallback, useEffect, useState } from 'react';
import { useContextApi } from '../../ApiContext';
import { SearchFilter, SearchKind, SearchOrder } from './types';

export const useAlgoliaSearch = <T extends object>(
  enabled: boolean,
  kind: SearchKind,
  order: SearchOrder,
  filterArray: SearchFilter[],
  aroundLatLng: LatLng | undefined | null,
  query: string = ''
) => {
  // context
  const api = useContextApi();
  // state
  const [lastResponse, setLastResponse] = useState<SearchResponse<T>>();
  const [responseByPage, setResponseByPage] =
    useState<Map<number | undefined, SearchResponse<T>>>();
  const [results, setResults] = useState<T[]>();
  const [loading, setLoading] = useState(enabled);
  // handlers
  const search = useCallback(
    async (input: string, page?: number) => {
      if (!enabled) return;
      if (!aroundLatLng) return;
      setLastResponse(undefined);
      setLoading(true);
      try {
        setLastResponse(
          await api
            .algolia()
            .search<T>({ kind, order, filterArray, aroundLatLng, query: input, page })
        );
      } catch (error) {
        if (error instanceof Error) crashlytics().recordError(error);
        console.log(error);
      }
      setLoading(false);
    },
    [api, enabled, aroundLatLng, kind, order, filterArray]
  );
  // side effects
  // clearing cache
  useEffect(() => {
    api.algolia().clearCache();
    search('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api]);
  // debounced search
  useDebounce(query, search, query.length > 3);
  // update responseByPage
  useEffect(() => {
    if (!lastResponse) {
      setResponseByPage(undefined);
      setResults(undefined);
      return;
    }
    setResponseByPage((current) => {
      const value = current ? new Map(current.entries()) : new Map();
      value.set(lastResponse.page, lastResponse);
      return value;
    });
  }, [lastResponse]);
  // update results when response changes
  useEffect(() => {
    if (!responseByPage) return;
    const keys = Array.from(responseByPage.keys()).sort();
    if (!keys.length) setResults([]);
    else {
      setResults(
        keys.reduce((result, key) => [...result, ...responseByPage.get(key)!.hits], [] as T[])
      );
    }
  }, [responseByPage]);
  // result
  const fetchNextPage = useCallback(() => {
    console.log('fetchNextPage', lastResponse, query);
    if (!lastResponse) return;
    const hasNextPage = lastResponse.page + 1 < lastResponse.nbPages;
    // console.log('hasNextPage', hasNextPage);
    if (hasNextPage) search(query, lastResponse.page + 1).then(null);
  }, [lastResponse, query, search]);
  // }, [name, aroundLatLng, filters, lastResponse, responseByPage, search]);

  const refetch = () => {
    if (query === undefined) return;
    return search(query);
  };

  return { results, isLoading: loading, refetch, fetchNextPage };
};
