import axios from 'axios';
import {Post, PostEntity, NewPost} from './post';
import {UserEntity} from './user';

const USERS_URL = 'https://jsonplaceholder.typicode.com/users';
const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';

export default class ApiService {
  posts: Post[] = [];
  users = [];

  public getPosts(): Promise<Post[]> {
    return axios.get<PostEntity[]>(POSTS_URL).then((response) => {
      return this.convertPostEntitiesToPosts(response.data as PostEntity[]);
    });
  }

  public deletePost(post_id: number): Promise<number> {
    return axios.delete<number>(`${POSTS_URL}/${post_id}`).then(() => {
      return post_id;
    });
  }

  public savePost(post: NewPost): Promise<Post> {
    return axios.post<PostEntity>(POSTS_URL, post).then((response) => {
      const data = response.data as PostEntity;
      const postEntity: PostEntity = {
        ...post,
        id: data.id,
      };
      return this.convertPostEntityToPost(postEntity);
    });
  }

  public updatePost(post: Post): Promise<Post> {
    return axios.put<PostEntity>(`${POSTS_URL}/${post.id}`, post).then(() => {
      return post;
    });
  }

  public getUsers(): Promise<UserEntity[]> {
    return axios.get<UserEntity[]>(USERS_URL).then((response) => {
      return response.data as UserEntity[];
    });
  }

  protected convertPostEntityToPost(postEntity: PostEntity): Post {
    const posts = this.convertPostEntitiesToPosts([postEntity]);
    return posts[0];
  }

  protected convertPostEntitiesToPosts(
    postEntities: PostEntity[] = []
  ): Post[] {
    return postEntities.map((data: PostEntity) => {
      const post: Post = <Post>{
        ...data,
        date: new Date().toISOString(),
        reactions: {
          thumbsUp: 0,
          wow: 0,
          heart: 0,
          rocket: 0,
          coffee: 0,
        },
      };

      return post;
    });
  }
}
