import 'react-native-url-polyfill/auto';
import {createClient} from '@supabase/supabase-js';
import {storage} from './storage';

const SUPABASE_URL = 'https://xuywudntgfvuxunkdnlo.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1eXd1ZG50Z2Z2dXh1bmtkbmxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMDczOTYsImV4cCI6MjA5MDU4MzM5Nn0.qwj10ZGWTsjfY6QkqmcHhQDZ2doQilBl1PI6DuxpNBs';

const MMKVStorageAdapter = {
  getItem: (key: string): string | null => {
    return storage.getString(key) ?? null;
  },
  setItem: (key: string, value: string): void => {
    storage.set(key, value);
  },
  removeItem: (key: string): void => {
    storage.delete(key);
  },
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: MMKVStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
