/* eslint-disable  @typescript-eslint/no-explicit-any */
export type ActionFunction = <T>(a: T, ...rest: unknown[]) => T;

export interface Clause {
  type: string;
  result: ActionFunction;
}

export interface State<T> {
  name?: string;
  state: T;
  clauses: Map<string, ActionFunction>;
}

export interface SideEffect {
  name?: string;
  dispatcher: StoreInterface;
  effects: Map<string, ActionFunction>;
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

export interface StoreInterface {
  addReducer(slice: string, s: State<unknown>);
  addSideEffect(slice: string, sideEffects: SideEffect);
  select<T>(slice: string): T;
  register(storeListener: StoreListenerInterface);
  dispatch(action: Action);
}

export interface StoreListenerInterface {
  stateChanged(store: StoreInterface);
}

export interface Action {
  type: string;
  slice: string;
  payload?: any;
}

export const removeSpaces = (s: string) => s.replace(/\s+/g, '');
export const getTimeString = () => '' + new Date().getTime();

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
  let slice = typeof group.slice === 'string' ? group.slice : '';
  slice = (removeSpaces(slice) || 'ag') + getTimeString();
  group.slice = slice;
  for (const key in events) {
    if (key !== 'slice' && events.hasOwnProperty(key)) {
      const value = events[key];
      const func: () => Action = value(slice);
      output[key] = func;
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

export const createClauses = (rest: Clause[]): Map<string, ActionFunction> => {
  return (Array.isArray(rest) ? rest : []).reduce((clauses, item) => {
    const type = item.type;
    clauses.set(type, item.result);
    return clauses;
  }, new Map());
};

export function createReducer<T>(initialState: T, ...rest): State<T> {
  const clauses: Map<string, ActionFunction> = createClauses(rest);

  return <State<T>>{
    state: initialState,
    clauses,
  };
}

export function createSideEffect(...rest): SideEffect {
  const effects: Map<string, ActionFunction> = createClauses(rest);

  return <SideEffect>{
    effects,
  };
}

export class Store implements StoreInterface {
  public id: string;
  private store: Map<string, State<unknown>>;
  private sideEffects: Map<string, SideEffect>;
  private listeners: Set<StoreListenerInterface>;

  constructor() {
    this.id = 'store' + getTimeString();
    this.store = new Map();
    this.sideEffects = new Map();
    this.listeners = new Set();
  }

  select<T>(slice: string): T {
    const state: State<T> = <State<T>>this.store.get(slice);
    return state?.state;
  }

  register(storeListener: StoreListenerInterface) {
    this.listeners.add(storeListener);
  }

  checkSliceName(slice: string): boolean {
    return /\w+\d{12,}/.test(slice) && !/\s+/.test(slice);
  }

  addReducer(slice: string, store: State<unknown>) {
    if (this.checkSliceName(slice)) {
      store.name = slice;
      this.store.set(slice, store);
    }
  }

  addSideEffect(slice: string, sideEffects: SideEffect) {
    if (this.checkSliceName(slice)) {
      sideEffects.name = slice;
      sideEffects.dispatcher = this;
      this.sideEffects.set(slice, sideEffects);
    }
  }

  dispatch(action: Action) {
    const store: State<unknown> = this.store.get(action.slice);
    const sideEffect: SideEffect = this.sideEffects.get(action.slice);

    if (store) {
      const currentState = store.state;
      const clauses = store.clauses;
      if (clauses) {
        const clause = clauses.get(action.type);
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

    if (sideEffect) {
      const effect = sideEffect.effects.get(action.type);
      if (effect) {
        effect(action, this);
      }
    }
  }
}

export function createStore() {
  return new Store();
}

/* eslint-enable  @typescript-eslint/no-explicit-any */
