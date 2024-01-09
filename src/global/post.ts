export interface NewPost {
  title: string;
  userId: number;
  body: string;
}

export interface PostEntity extends NewPost {
  id: number;
}

interface ReactionsBody {
  thumbsUp: number;
  wow: number;
  heart: number;
  rocket: number;
  coffee: number;
}

export interface Post extends PostEntity {
  name?: string;
  date?: string;
  reactions?: ReactionsBody;
}

export type Reactions = 'thumbsUp' | 'wow' | 'heart' | 'rocket' | 'coffee';
export type UpdateObject = {post: Post; value: Reactions};

export enum PostEvent {
  IncrementReaction = 'post:increment-reaction',
  DeletePost = 'post:delete',
  SavePost = 'post:save',
}

export interface PostEventPayload {
  postId: string;
  post?: Post;
}
