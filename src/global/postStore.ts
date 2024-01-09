import {
  createAction,
  createActionGroup,
  createReducer,
  on,
  EntityState,
  createSideEffect,
  ActionGroup,
  ActionsList,
} from './state';
import {Post} from './post';
import {apiService} from './api';

export interface PostState extends EntityState<Post[]> {
  entities: Post[];
  selectedId?: string | number; // which Labels record has been selected
  loaded: boolean;
  error?: Error | null; // last known error (if any)
}

export const initialPostsState: PostState = {
  entities: [],
  // set initial required properties
  loaded: false,
  error: null,
};

export const PostActions: ActionsList = createActionGroup(<ActionGroup>{
  slice: 'posts',
  events: {
    getPosts: createAction('Get Posts'),
    loadPosts: createAction('Load Posts'),
    loadPostsSuccess: createAction<{posts: Post[]}>('Load Posts Success'),
    loadPostsFailure: createAction<{error: Error}>('Load Posts Failure'),
  },
});

const setState = (
  state: PostState,
  loaded: boolean,
  error: Error | null = null
): PostState => {
  return <PostState>{...state, loaded, error};
};

function setAll(posts: Post[], state: PostState) {
  return <PostState>Object.assign({}, state, {entities: posts});
}

export const postReducer = createReducer<PostState>(
  initialPostsState,
  on(PostActions.getPosts, (state) => setState(state, true, null)),
  on(PostActions.loadPostsSuccess, (state, action) => {
    return setAll(action.payload, setState(state, true, null));
  }),
  on(PostActions.loadPostsFailure, (state, {error}) =>
    setState(state, true, error)
  )
);

export const postEffects = createSideEffect(
  on(PostActions.loadPosts, (action, dispatcher) => {
    apiService.getPosts().then((posts) => {
      const result = PostActions.loadPostsSuccess(posts);
      dispatcher.dispatch(result);
    });
  })
);
