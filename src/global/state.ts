import {LitElement} from 'lit';

/* eslint-disable  @typescript-eslint/no-explicit-any */
type ActionFunction = <T>(a: T, ...rest: unknown[]) => T;

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

interface ActionGroupBase {
  slice: string;
}

interface ActionGroupFunction {
  [propName: string]: (...any) => any;
}

export type ActionGroup = ActionGroupBase & ActionGroupFunction;

const removeSpaces = (s: string) => s.replace(/\s+/, '');
const getDateString = () => '' + new Date().getTime();

class Action {
  type: string;
  slice: string;
  payload: any;

  constructor(type: string, payload: any = undefined) {
    this.type = removeSpaces(type);
    this.payload = payload;
  }
}

export function createActionGroup(group: ActionGroup): ActionGroup {
  let slice = typeof group['slice'] === 'string' ? group['slice'] : '';
  slice = removeSpaces(slice) + getDateString();
  group['slice'] = slice;
  for (const key in group) {
    if (group.hasOwnProperty(key)) {
      const value = group[key];
      if (key !== 'slice' && typeof value != 'string') {
        const func: () => Action = value(slice);

        group[key] = func;
      }
    }
  }
  return group as ActionGroup;
}

export function createAction<T>(type: string) {
  return function (slice: string) {
    return (prop?: T) => {
      const action = new Action(removeSpaces(type), prop);
      action.slice = slice;
      return action;
    };
  };
}

export function on(key: () => Action, func: (a, ...rest) => unknown): Clause {
  return {type: key().type, result: func as ActionFunction};
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

export function createSideEffect(...rest): SideEffect {
  const effects = rest.reduce((sideEffects, item) => {
    const type = removeSpaces(item.type);
    sideEffects[type] = item.result;
    return sideEffects;
  }, {});

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
    this.id += getDateString();
    this.store = new Map();
    this.sideEffects = new Map();
    this.listeners = new Set();
  }

  register(x: StoreListenerInterface) {
    this.listeners.add(x);
  }

  addReducer(
    slice: string,
    store: State<unknown>,
    sideEffects: SideEffect = undefined
  ) {
    const type = removeSpaces(slice) ?? getDateString();
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
            item.stateChanged(this.store);
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
  addReducer(name: string, s: State<unknown>);
  register(x: StoreListenerInterface);
  dispatch(action: Action);
}

export function createStore() {
  return new Store();
}

type Constructor<T> = new (...args: any[]) => T;

export interface StoreListenerInterface {
  stateChanged(state: Map<string, State<T>>);
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

      abstract stateChanged(state: Map<string, State<T>>);
    }

    return MgPostBaseElement as Constructor<StoreListenerInterface> & T;
  };

  return Connect;
};
/* eslint-enable  @typescript-eslint/no-explicit-any */
