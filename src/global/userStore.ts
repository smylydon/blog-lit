import {
  createAction,
  createActionGroup,
  createReducer,
  on,
  EntityState,
  createSideEffect,
  ActionGroup,
  ActionsList,
  State,
} from './state';
import {UserEntity} from './user';
import {apiService} from './api';

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
    getUsers: createAction('Get Users'),
    loadUsers: createAction('Load Users'),
    loadUsersSuccess: createAction<{users: UserEntity[]}>('Load Users Success'),
    loadUsersFailure: createAction<{error: Error}>('Load Users Failure'),
  },
});

const setState = (
  state: UserState,
  loaded: boolean,
  error: Error | null = null
): UserState => {
  return <UserState>{...state, loaded, error};
};

function setAll(users: UserEntity[], state: UserState) {
  return <UserState>Object.assign({}, state, {entities: users});
}

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

export const getUsersFromStore = (state: Map<string, State<unknown>>) => {
  const value: State<UserState> = state?.get(
    UserActions.slice()
  ) as State<UserState>;
  const userState: UserState = value?.state;
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
