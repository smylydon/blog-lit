export interface NewPost {
  title: string;
  userId: number;
  body: string;
}

export interface PostEntity extends NewPost {
  id: number;
}

export interface Post extends PostEntity {
  name?: string;
  date?: string;
  reactions?: {
    thumbsUp: number;
    wow: number;
    heart: number;
    rocket: number;
    coffee: number;
  };
}

export type Reactions = 'thumbsUp' | 'wow' | 'heart' | 'rocket' | 'coffee';
export type UpdateObject = {post: Post; value: Reactions};
