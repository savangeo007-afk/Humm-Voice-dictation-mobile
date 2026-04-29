import {useState, useCallback} from 'react';
import {storage} from '../services/storage';

export function useStorageString(key: string, defaultValue: string = '') {
  const [value, setValue] = useState(
    () => storage.getString(key) ?? defaultValue,
  );

  const set = useCallback(
    (newValue: string) => {
      storage.set(key, newValue);
      setValue(newValue);
    },
    [key],
  );

  return [value, set] as const;
}

export function useStorageBoolean(key: string, defaultValue: boolean = false) {
  const [value, setValue] = useState(
    () => storage.getBoolean(key) ?? defaultValue,
  );

  const set = useCallback(
    (newValue: boolean) => {
      storage.set(key, newValue);
      setValue(newValue);
    },
    [key],
  );

  return [value, set] as const;
}

export function useStorageObject<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    const json = storage.getString(key);
    if (!json) {
      return defaultValue;
    }
    try {
      return JSON.parse(json) as T;
    } catch {
      return defaultValue;
    }
  });

  const set = useCallback(
    (newValue: T) => {
      storage.set(key, JSON.stringify(newValue));
      setValue(newValue);
    },
    [key],
  );

  return [value, set] as const;
}
