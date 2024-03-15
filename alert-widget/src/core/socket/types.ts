export type SocketEventHandler<T> = (payload: T | null) => void | Promise<void>;
