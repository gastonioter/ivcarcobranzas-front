export const getLocalStorage = (key: string): string | null => {
  return localStorage.getItem(key);
};

export const setLocalStorage = (key: string, value: string): void => {
  localStorage.setItem(key, value);
};

export const removeLocalStorage = (key: string): void => {
  localStorage.removeItem(key);
};
