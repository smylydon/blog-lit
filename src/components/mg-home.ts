//import "./index.scss";
import {LitElement, html} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import {Post} from './post';
import {posts} from './data';

/**
 * Home element.
 * display a list of posts.
 */
@customElement('mg-home')
export class MgHome extends LitElement {
  @state()
  posts: Post[] = posts as Post[];

  override render() {
    const view = this.posts.map((post: Post) => {
      const value = JSON.stringify(post);
      return html`<mg-post issingle="true" post=${value} />`;
    });
    return html`${view}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mg-home': MgHome;
  }
}
