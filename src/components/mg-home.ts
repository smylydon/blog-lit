//import "./index.scss";
import {LitElement, html} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {Post} from './post';
import {posts} from './data';
import styles from './mg-home.scss';

/**
 * Home element.
 * display a list of posts.
 */
@customElement('mg-home')
export class MgHome extends LitElement {
  static override styles = styles;

  @property()
  view = 'list-post';

  @property()
  postId: string | undefined;

  @state()
  posts: Post[] = posts.map((post) => {
    post.date = new Date().toISOString();
    return post;
  }) as Post[];

  override render() {
    const isSinglePost = ['view-post', 'edit-post'].includes(this.view);
    const id = Number(this.postId);
    const postId = isFinite(id) ? id : undefined;

    let output;
    if (isSinglePost) {
      const post = posts.find((post) => post.id === postId);
      const value = post ? JSON.stringify(post) : JSON.stringify({});
      if (this.view === 'view-post') {
        output = html`<mg-post issingle="true" post=${value} />`;
      } else if (this.view === 'edit-post') {
        // will add new component
        output = html`<mg-post issingle="true" post=${value} />`;
      }
    } else {
      output = this.posts.map((post: Post) => {
        const value = JSON.stringify(post);
        return html`<mg-post issingle="false" post=${value} />`;
      });
    }
    return html`${output}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mg-home': MgHome;
  }
}
