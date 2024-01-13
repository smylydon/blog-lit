import {LitElement} from 'lit';
import {Store, StoreInterface, StoreListenerInterface} from './state';
/* eslint-disable  @typescript-eslint/no-explicit-any */
type Constructor<T> = new (...args: any[]) => T;

export const connect = function (store: Store) {
  const Connect = <T extends Constructor<LitElement>>(superClass: T) => {
    abstract class MgPostBaseElement
      extends superClass
      implements StoreListenerInterface
    {
      constructor(...a: any[]) {
        super(a);
        store.register(this);
      }

      abstract stateChanged(store: StoreInterface);
    }

    return MgPostBaseElement as Constructor<StoreListenerInterface> & T;
  };

  return Connect;
};
/* eslint-enable  @typescript-eslint/no-explicit-any */
