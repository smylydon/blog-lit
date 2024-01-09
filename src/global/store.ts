import {createStore, Store} from './state';

import {PostActions, postReducer, postEffects} from './postStore';
import {UserActions, userReducer, userEffects} from './userStore';

export const store: Store = createStore();
store.addReducer(PostActions.slice(), postReducer, postEffects);
store.addReducer(UserActions.slice(), userReducer, userEffects);

// export const PostActions = createActionGroup({
//   source: 'Post',
//   events: {
//     'Get Posts': emptyProps(),
//     'Load Posts': emptyProps(),
//     'Load Posts Success': props<{posts: Post[]}>(),
//     'Load Posts Failure': props<{error: Error}>(),
//     'Save Post': props<{post: NewPost}>(),
//     'Save Post Success': props<{post: Post}>(),
//     'Save Post Failure': props<{error: Error}>(),
//     'Update Post': props<{update: Post}>(),
//     'Update Post Success': props<{update: Update<Post>}>(),
//     'Update Post Failure': props<{error: Error}>(),
//     'Update Reaction': props<{update: Update<Post>}>(),
//     'Delete Post': props<{post_id: number}>(),
//     'Delete Post Success': props<{post_id: number}>(),
//     'Delete Post Failure': props<{error: Error}>(),
//   },
// });

// export const postReducer = createReducer(
//     initialPostsState,
//     on(PostActions.getPosts, (state) => setState(state, true, null)),
//     on(PostActions.loadPosts, (state) => setState(state, false, null)),
//     on(PostActions.loadPostsSuccess, (state, { posts }) => {
//       return postsAdapter.setAll(posts, setState(state, true, null));
//     }),
//     on(PostActions.loadPostsFailure, (state, { error }) =>
//       setState(state, true, error)
//     ),
//     on(PostActions.savePostSuccess, (state, { post }) => {
//       return postsAdapter.addOne(post, setState(state, true, null));
//     }),
//     on(PostActions.savePostFailure, (state, { error }) =>
//       setState(state, true, error)
//     ),

//     on(PostActions.updatePostSuccess, (state, { update }) => {
//       return postsAdapter.updateOne(update, setState(state, true));
//     }),
//     on(PostActions.updatePostFailure, (state, { error }) =>
//       setState(state, true, error)
//     ),
//     on(PostActions.updateReaction, (state, { update }) => {
//       return postsAdapter.updateOne(update, setState(state, true));
//     }),
//     on(PostActions.deletePostSuccess, (state, { post_id }) => {
//       return postsAdapter.removeOne(post_id, setState(state, true, null));
//     }),
//     on(PostActions.deletePostFailure, (state, { error }) =>
//       setState(state, true, error)
//     )
//   );
