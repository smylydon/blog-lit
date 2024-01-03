import {LitElement} from 'lit';

type ActionFunction = (a: T, ...rest) => T;

export interface Clause {
  type: string;
  result: ActionFunction;
}

export interface State<T> {
  name?: string;
  state: T;
  clauses: Record<string, ActionFunction>;
}

export interface EntityState<T> {
  entities: T;
}

const removeSpaces = (s: string) => s.replace(/\s+/, '');

class Action {
  type: string;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  payload: any;

  constructor(type: string, payload: any = undefined) {
    this.type = removeSpaces(type);
    this.payload = payload;
  }
  /* eslint-enable  @typescript-eslint/no-explicit-any */
}

export function createAction<T>(type: string) {
  return (prop?: T) => new Action(type, prop);
}

export function on(key: () => Action, func: ActionFunction): Clause {
  return {type: key().type, result: func};
}

export function createReducer<T>(initialState: T, ...rest): State<T> {
  const clauses = rest.reduce((clauses, item) => {
    const type = removeSpaces(item.type);
    clauses[type] = item.result;
    return clauses;
  }, {});
  return <State<T>>{
    state: initialState,
    clauses,
  };
}
/* eslint-disable  @typescript-eslint/no-explicit-any */

class Store {
  public id: 'store';
  private store: Map<string, State<unknown>>;
  private listeners: Set<StoreInterface>;

  constructor() {
    this.id += new Date().getDate();
    this.store = new Map();
    this.listeners = new Set();
  }

  register(x: unknown) {
    this.listeners.add(x as StoreInterface);
  }

  addReducer(name: string, s: State<unknown>) {
    const type = removeSpaces(name) ?? '' + new Date().getDate();
    this.store.set(type, s);
  }

  dispatch(action: Action) {
    for (const item of this.store) {
      const type = item[0];
      const reducer = item[1];
      const clauses = reducer.clauses;
      if (clauses) {
        const clause = clauses[action.type];
        if (clause) {
          const state = clause(reducer.state, action);
          reducer.state = state;
          // an rxjs subject would be lovely right now.
        }
      }
    }

    this.listeners.forEach((item: StoreInterface) => {
      item.stateChanged(this.store);
    });
  }
}

export function createStore() {
  return new Store();
}

type Constructor<T> = new (...args: any[]) => T;

export declare class StoreInterface {
  stateChanged(state: Map<string, State<T>>);
}

export const connect = function (store: Store) {
  const Connect = <T extends Constructor<LitElement>>(superClass: T) => {
    abstract class MgPostBaseElement extends superClass {
      constructor(...a: any[]) {
        super(a);
        store.register(this);
      }
    }

    return MgPostBaseElement as Constructor<StoreInterface> & T;
  };

  return Connect;
};
/* eslint-enable  @typescript-eslint/no-explicit-any */
