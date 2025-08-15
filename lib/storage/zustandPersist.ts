import { createJSONStorage } from 'zustand/middleware';
import { mmkv } from './mmkv';

export const zustandStorage = {
  getItem: (name: string) => {
    const value = mmkv.getString(name)
    return value ?? null
  },
  setItem: (name: string, value: string) => {
    mmkv.set(name, value)
  },
  removeItem: (name: string) => {
    mmkv.delete(name)
  },
}
export const jsonZustandStorage = createJSONStorage(() => zustandStorage)