import {Post, PostEntity, NewPost} from './post';
import {UserEntity} from './user';

const USERS_URL = 'https://jsonplaceholder.typicode.com/users';
const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';

export default class ApiService {
  public getPosts(): Promise<Post[]> {
    return fetch(POSTS_URL)
      .then((response: Response) => {
        return response.json();
      })
      .then((data: Post[]) => {
        return this.convertPostEntitiesToPosts(data);
      });
  }

  public deletePost(post_id: number): Promise<number> {
    return fetch(`${POSTS_URL}/${post_id}`, {
      method: 'DELETE',
    })
      .then((response: Response) => {
        return response.json();
      })
      .then(() => {
        return post_id;
      });
  }

  public savePost(post: NewPost): Promise<Post> {
    return fetch(POSTS_URL, {
      method: 'POST',
      body: JSON.stringify(post),
    })
      .then((response: Response) => {
        return response.json();
      })
      .then((data: PostEntity) => {
        const postEntity: PostEntity = {
          ...post,
          id: data.id,
        };
        return this.convertPostEntityToPost(postEntity);
      });
  }

  public updatePost(post: Post): Promise<Post> {
    return fetch(`${POSTS_URL}/${post.id}`, {
      method: 'PUT',
      body: JSON.stringify(post),
    }).then(() => {
      return post;
    });
  }

  public getUsers(): Promise<UserEntity[]> {
    return fetch(USERS_URL)
      .then((response: Response) => {
        return response.json();
      })
      .then((data: UserEntity[]) => {
        return data;
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

export const apiService = new ApiService();
