import {createStore, Store} from './state';

import {PostActions, postReducer, postEffects} from './postStore';
import {UserActions, userReducer, userEffects} from './userStore';

export const cloneObject = (item) => JSON.parse(JSON.stringify(item));

export const store: Store = createStore();
store.addReducer(PostActions.slice(), postReducer, postEffects);
store.addReducer(UserActions.slice(), userReducer, userEffects);
