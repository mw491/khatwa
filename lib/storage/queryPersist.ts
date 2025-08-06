// src/storage/queryPersist.ts
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { mmkv } from './mmkv';

export const mmkvPersister = createAsyncStoragePersister({
  storage: {
    getItem: (key: string) => mmkv.getString(key) ?? null,
    setItem: (key: string, value: string) => mmkv.set(key, value),
    removeItem: (key: string) => mmkv.delete(key),
  },
});
