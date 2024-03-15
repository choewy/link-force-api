export type SocketEventHandler<T> = (payload?: T) => void | Promise<void>;
