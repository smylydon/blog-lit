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
import {Post, PostEventPayload} from './post';
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
    incrementReaction: createAction<{postEventPayload: PostEventPayload}>(
      'Increment Reaction'
    ),
    deletePost: createAction<{postEventPayload: PostEventPayload}>(
      'Delete Post'
    ),
    deletePostSuccess: createAction<{post: Post}>('Delete Post Success'),
    deletePostFailure: createAction<{error: Error}>('Delete Post Failure'),
    loadPosts: createAction('Load Posts'),
    loadPostsSuccess: createAction<{posts: Post[]}>('Load Posts Success'),
    loadPostsFailure: createAction<{error: Error}>('Load Posts Failure'),
    savePost: createAction<{postEventPayload: PostEventPayload}>('Save Post'),
    savePostSuccess: createAction<{post: Post}>('Save Post Success'),
    savePostFailure: createAction<{error: Error}>('Save Post Failure'),
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
  ),
  on(PostActions.incrementReaction, (state, action) => {
    const postEventPayload: PostEventPayload = action.payload;
    const postId = Number(postEventPayload.postId);
    const oldPost = postEventPayload.post;
    const newPost: Post = state.entities.find(
      (post: Post) => post.id === postId
    );
    if (newPost) {
      newPost.reactions = oldPost.reactions;
      state.entities = [...state.entities];
    }
    return setState(state, true, null);
  }),
  on(PostActions.deletePostSuccess, (state, action) => {
    const postId = Number(action.payload);
    state.entities = state.entities.filter((post: Post) => post.id !== postId);
    return setState(state, true, null);
  })
);

export const postEffects = createSideEffect(
  on(PostActions.loadPosts, (action, dispatcher) => {
    apiService.getPosts().then((posts) => {
      const result = PostActions.loadPostsSuccess(posts);
      dispatcher.dispatch(result);
    });
  }),
  on(PostActions.deletePost, (action, dispatcher) => {
    const postEventPayload: PostEventPayload = action.payload;
    const postId = Number(postEventPayload.postId);
    apiService.deletePost(postId).then((id) => {
      const result = PostActions.deletePostSuccess(id);
      dispatcher.dispatch(result);
    });
  })
);
