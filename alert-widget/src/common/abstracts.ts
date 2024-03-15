export abstract class IEvent<T> extends CustomEvent<T> {
  dispatch() {
    window.dispatchEvent(this);
  }
}
