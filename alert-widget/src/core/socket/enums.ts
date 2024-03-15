export enum SocketSubEvent {
  Connect = 'connect',
  Error = 'error',
  Exception = 'exception',
  Disconnect = 'disconnect',
  Setting = 'setting',
  Play = 'play',
  Clear = 'clear',
}

export enum SocketPubEvent {
  PlayComplete = 'play',
}
