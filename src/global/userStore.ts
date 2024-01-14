import {
  createActionGroup,
  createReducer,
  emptyPayload,
  propPayload,
  on,
  EntityState,
  createSideEffect,
  ActionGroup,
  ActionsList,
  StoreInterface,
} from './state';
import {UserEntity} from './user';
import {apiService} from './api';
import {setAll, setState} from './entity';

export interface UserState extends EntityState<UserEntity[]> {
  entities: UserEntity[];
  selectedId?: string | number; // which Labels record has been selected
  loaded: boolean;
  error?: Error | null; // last known error (if any)
}

export const initialUsersState: UserState = {
  entities: [],
  // set initial required properties
  loaded: false,
  error: null,
};

export const UserActions: ActionsList = createActionGroup(<ActionGroup>{
  slice: 'users',
  events: {
    getUsers: emptyPayload('Get Users'),
    loadUsers: emptyPayload('Load Users'),
    loadUsersSuccess: propPayload<{users: UserEntity[]}>('Load Users Success'),
    loadUsersFailure: propPayload<{error: Error}>('Load Users Failure'),
  },
});

export const userReducer = createReducer<UserState>(
  initialUsersState,
  on(UserActions.getUsers, (state) => setState(state, true, null)),
  on(UserActions.loadUsersSuccess, (state, action) => {
    return setAll(action.payload, setState(state, true, null));
  }),
  on(UserActions.loadUsersFailure, (state, {error}) =>
    setState(state, true, error)
  )
);

export const userEffects = createSideEffect(
  on(UserActions.loadUsers, (action, dispatcher) => {
    apiService.getUsers().then((users) => {
      const result = UserActions.loadUsersSuccess(users);
      dispatcher.dispatch(result);
    });
  })
);

export const getUsersFromStore = (store: StoreInterface) => {
  const userState: UserState = store.select(UserActions.slice());
  const entities: UserEntity[] = userState?.entities;
  return entities ?? [];
};

export const getSelectorValues = (users: UserEntity[]) => {
  return (Array.isArray(users) ? users : []).map((user) => {
    return {
      id: user.id,
      item: user.name,
    };
  });
};
