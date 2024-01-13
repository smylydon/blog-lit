import {LitElement} from 'lit';

/* eslint-disable  @typescript-eslint/no-explicit-any */
export type ActionFunction = <T>(a: T, ...rest: unknown[]) => T;

export interface Clause {
  type: string;
  result: ActionFunction;
}

export interface State<T> {
  name?: string;
  state: T;
  clauses: Record<string, ActionFunction>;
}

export interface SideEffect {
  name?: string;
  dispatcher: StoreInterface;
  effects: Record<string, ActionFunction>;
}

export interface EntityState<T> {
  entities: T;
}

export interface ActionGroup {
  slice: string;
  events: {
    [propName: string]: (...any) => any;
  };
}

export interface ActionsList {
  [propName: string]: (...any) => any;
}

export const removeSpaces = (s: string) => s.replace(/\s+/g, '');
export const getTimeString = () => '' + new Date().getTime();

export interface Action {
  type: string;
  slice: string;
  payload?: any;
}

class ActionType implements Action {
  type: string;
  slice: string;
  payload: any;

  constructor(type: string, payload: any = undefined) {
    this.type = removeSpaces(type);
    this.payload = payload;
  }
}

export function createActionGroup(group: ActionGroup): ActionsList {
  const output = {};
  const events = group.events;
  let slice = typeof group['slice'] === 'string' ? group['slice'] : '';
  slice = removeSpaces(slice) + getTimeString();
  group['slice'] = slice;
  for (const key in events) {
    if (events.hasOwnProperty(key)) {
      const value = events[key];
      if (key !== 'slice') {
        const func: () => Action = value(slice);
        output[key] = func;
      }
    }
  }
  output['slice'] = () => slice;
  return output as ActionsList;
}

export function emptyPayload(type: string) {
  return function (slice: string) {
    return () => {
      const action = new ActionType(removeSpaces(type));
      action.slice = slice;
      return action;
    };
  };
}

export function propPayload<T>(type: string) {
  return function (slice: string) {
    return (prop: T) => {
      const action = new ActionType(removeSpaces(type), prop);
      action.slice = slice;
      return action;
    };
  };
}

export function on(key: () => Action, func: (a, ...rest) => unknown): Clause {
  return {type: key().type, result: func as ActionFunction};
}

export const createClauses = (rest) => {
  return (Array.isArray(rest) ? rest : []).reduce((clauses, item) => {
    const type = removeSpaces(item.type);
    clauses[type] = item.result;
    return clauses;
  }, {});
};

export function createReducer<T>(initialState: T, ...rest): State<T> {
  const clauses = createClauses(rest);

  return <State<T>>{
    state: initialState,
    clauses,
  };
}

export function createSideEffect(...rest): SideEffect {
  const effects = createClauses(rest);

  return <SideEffect>{
    effects,
  };
}

export class Store implements StoreInterface {
  public id: 'store';
  private store: Map<string, State<unknown>>;
  private sideEffects: Map<string, SideEffect>;
  private listeners: Set<StoreListenerInterface>;

  constructor() {
    this.id += getTimeString();
    this.store = new Map();
    this.sideEffects = new Map();
    this.listeners = new Set();
  }

  select<T>(slice: string): T {
    const state: State<T> = <State<T>>this.store.get(slice);
    return state?.state;
  }

  register(x: StoreListenerInterface) {
    this.listeners.add(x);
  }

  addReducer(
    slice: string,
    store: State<unknown>,
    sideEffects: SideEffect = undefined
  ) {
    const type = removeSpaces(slice) ?? getTimeString();
    store.name = slice;
    this.store.set(type, store);
    if (sideEffects) {
      sideEffects.name = slice;
      sideEffects.dispatcher = this;
      this.sideEffects.set(type, sideEffects);
    }
  }

  dispatch(action: Action) {
    const store: State<unknown> = this.store.get(action.slice);
    const sideEffects: SideEffect = this.sideEffects.get(action.slice);

    if (store) {
      const currentState = store.state;
      const clauses = store.clauses;
      if (clauses) {
        const clause = clauses[action.type];
        if (clause) {
          const state = clause(currentState, action);
          store.state = state;
          this.listeners.forEach((item: StoreListenerInterface) => {
            item.stateChanged(this);
          });
          // an rxjs subject would be lovely right now.
        }
      }
    }

    if (sideEffects) {
      const sideEffect = sideEffects?.effects[action.type];
      if (sideEffect) {
        sideEffect(action, this);
      }
    }
  }
}

export interface StoreInterface {
  addReducer(name: string, s: State<unknown>, sideEffects: SideEffect);
  select<T>(slice: string): T;
  register(x: StoreListenerInterface);
  dispatch(action: Action);
}

export function createStore() {
  return new Store();
}

type Constructor<T> = new (...args: any[]) => T;

export interface StoreListenerInterface {
  stateChanged(store: StoreInterface);
}

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
