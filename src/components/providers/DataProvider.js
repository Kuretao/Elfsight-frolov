import axios from 'axios';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback
} from 'react';

const API_URL = 'https://rickandmortyapi.com/api/character/';

const DataContext = createContext({});

function getQueryParams() {
  const params = new URLSearchParams(window.location.search);

  const pageParam = parseInt(params.get('page'), 10);
  const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  return {
    status: params.get('status') || '',
    gender: params.get('gender') || '',
    species: params.get('species') || '',
    name: params.get('name') || '',
    type: params.get('type') || '',
    page
  };
}

function setQueryParams(paramsObj) {
  const params = new URLSearchParams();

  Object.entries(paramsObj).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  const newUrl = `${window.location.pathname}${
    params.toString() ? '?' + params.toString() : ''
  }`;
  window.history.pushState(null, '', newUrl);
}

export function DataProvider({ children }) {
  const [activePage, setActivePage] = useState(1);
  const [characters, setCharacters] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isError, setIsError] = useState(false);
  const [info, setInfo] = useState({});
  const [filters, setFilters] = useState({
    status: '',
    gender: '',
    species: '',
    name: '',
    type: ''
  });
  const [speciesOptions, setSpeciesOptions] = useState([]);
  const [apiURL, setApiURL] = useState(API_URL);
  useEffect(() => {
    const { status, gender, species, name, type, page } = getQueryParams();
    setFilters({ status, gender, species, name, type });
    setActivePage(page);
  }, []);
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.status) params.set('status', filters.status.toLowerCase());
    if (filters.gender) params.set('gender', filters.gender.toLowerCase());
    if (filters.species) params.set('species', filters.species);
    if (filters.name) params.set('name', filters.name);
    if (filters.type) params.set('type', filters.type);
    params.set('page', activePage);

    const newUrl = `${API_URL}?${params.toString()}`;
    setApiURL(newUrl);
  }, [filters, activePage]);
  const fetchData = useCallback(async (url) => {
    setIsFetching(true);
    setIsError(false);

    try {
      const { data } = await axios.get(url);
      setCharacters(data.results);
      setInfo(data.info);
    } catch (e) {
      setIsError(true);
      setCharacters([]);
      setInfo({});
      console.error('Fetch error:', e);
    } finally {
      setIsFetching(false);
    }
  }, []);
  useEffect(() => {
    fetchData(apiURL);
  }, [apiURL, fetchData]);
  useEffect(() => {
    async function fetchSpeciesOptions() {
      try {
        const responses = await Promise.all([
          axios.get(API_URL + '?page=1'),
          axios.get(API_URL + '?page=2')
        ]);
        const allCharacters = responses.flatMap((r) => r.data.results);
        const uniqueSpecies = Array.from(
          new Set(allCharacters.map((c) => c.species))
        ).sort();
        setSpeciesOptions(uniqueSpecies);
      } catch (e) {
        console.error('Failed to fetch species options', e);
      }
    }
    fetchSpeciesOptions();
  }, []);
  const applyFilters = useCallback((newFilters) => {
    const params = {
      ...newFilters,
      page: 1
    };
    setQueryParams(params);
    setFilters(newFilters);
    setActivePage(1);
  }, []);
  const resetFilters = useCallback(() => {
    setQueryParams({});
    setFilters({
      status: '',
      gender: '',
      species: '',
      name: '',
      type: ''
    });
    setActivePage(1);
  }, []);

  const dataValue = useMemo(
    () => ({
      activePage,
      setActivePage,
      characters,
      isFetching,
      isError,
      info,
      filters,
      setFilters,
      speciesOptions,
      applyFilters,
      resetFilters,
      apiURL,
      setApiURL
    }),
    [
      activePage,
      characters,
      isFetching,
      isError,
      info,
      filters,
      speciesOptions,
      applyFilters,
      resetFilters,
      apiURL,
      setApiURL
    ]
  );

  return (
    <DataContext.Provider value={dataValue}>{children}</DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
