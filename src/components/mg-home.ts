import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {Post} from '../global/post';
import {HomeRoutes} from '../global/routes';
import styles from './mg-home.scss';

/**
 * Home element.
 * display a list of posts.
 */
@customElement('mg-home')
export class MgHome extends LitElement {
  static override styles = styles;

  @property()
  view = HomeRoutes.Home;

  @property()
  postId: string | undefined;

  @property({attribute: 'posts'})
  set setPosts(posts: string) {
    this.model = JSON.parse(posts);
  }

  @property({attribute: false})
  model: Post[] = [];

  override render() {
    const isSinglePost = [HomeRoutes.ViewPost, HomeRoutes.EditPost].includes(
      this.view
    );
    const id = Number(this.postId);
    const postId = isFinite(id) ? id : undefined;

    let output;
    if (isSinglePost) {
      const post = this.model.find((post) => post.id === postId);
      const value = post ? JSON.stringify(post) : JSON.stringify({});
      if (this.view === HomeRoutes.ViewPost) {
        output = html`<mg-post-single post=${value} />`;
      } else if (this.view === HomeRoutes.EditPost) {
        // will add new component
        output = html`<mg-edit-post post=${value} />`;
      }
    } else {
      output = this.model.map((post: Post) => {
        const value = JSON.stringify(post);
        return html`<mg-post-list post=${value} />`;
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
