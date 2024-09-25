export interface Poller<T> {
  delay: number;
  method: () => Promise<T>;
}
