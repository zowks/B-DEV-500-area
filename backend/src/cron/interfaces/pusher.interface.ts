export interface Pusher<T> {
  method: (data: T) => Promise<void>;
}
