import store from 'store2';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const save = (key: string, data: any): void => {
  store.set(key, data);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const load = (key: string): any => {
  return store.get(key);
};
