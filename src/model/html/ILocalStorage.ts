/**
 * type/interface for LocalStorage (browser API)
 */
export interface ILocalStorage {
  get length(): number;
  clear(): void;
  setItem(key: string, value: string): void;
  getItem(key: string): string|null;
  removeItem(key: string): void;
}
