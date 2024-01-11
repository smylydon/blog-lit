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
} from './state';
import {NewPost, Post, PostEventPayload} from './post';
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
    getPosts: emptyPayload('Get Posts'),
    incrementReaction: propPayload<{postEventPayload: PostEventPayload}>(
      'Increment Reaction'
    ),
    deletePost: propPayload<{postEventPayload: PostEventPayload}>(
      'Delete Post'
    ),
    deletePostSuccess: propPayload<{post: Post}>('Delete Post Success'),
    deletePostFailure: propPayload<{error: Error}>('Delete Post Failure'),
    loadPosts: emptyPayload('Load Posts'),

    loadPostsSuccess: propPayload<{posts: Post[]}>('Load Posts Success'),
    loadPostsFailure: propPayload<{error: Error}>('Load Posts Failure'),
    savePost: propPayload<{postEventPayload: PostEventPayload}>('Save Post'),
    savePostSuccess: propPayload<{post: Post}>('Save Post Success'),
    savePostFailure: propPayload<{error: Error}>('Save Post Failure'),
    updatePost: propPayload<{postEventPayload: PostEventPayload}>(
      'Update Post'
    ),
    updatePostSuccess: propPayload<{post: Post}>('Update Post Success'),
    updatePostFailure: propPayload<{error: Error}>('Update Post Failure'),
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
      newPost.reactions = (<Post>oldPost).reactions;
      state.entities = [...state.entities];
    }
    return setState(state, true, null);
  }),
  on(PostActions.deletePostSuccess, (state, action) => {
    const postId = Number(action.payload);
    state.entities = state.entities.filter((post: Post) => post.id !== postId);
    return setState(state, true, null);
  }),
  on(PostActions.deletePostFailure, (state, {error}) =>
    setState(state, true, error)
  ),
  on(PostActions.savePostSuccess, (state, action) => {
    const post: Post = action.payload;
    state.entities = [...state.entities, post];
    return setState(state, true, null);
  }),
  on(PostActions.savePostFailure, (state, {error}) =>
    setState(state, true, error)
  )
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
  }),
  on(PostActions.savePost, (action, dispatcher) => {
    const postEventPayload: PostEventPayload = action.payload;
    const newPost: NewPost = postEventPayload.post;
    apiService.savePost(newPost).then((post: Post) => {
      const result = PostActions.savePostSuccess(post);
      dispatcher.dispatch(result);
    });
  })
);
