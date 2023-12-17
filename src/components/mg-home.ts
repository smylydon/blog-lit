//import "./index.scss";
import {LitElement, html} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import {Post} from './post';
import {posts} from './data';

/**
 * An example element.
 *
 */
@customElement('mg-home')
export class MgHome extends LitElement {
  @state()
  posts: Post[] = posts as Post[];

  override render() {
    const view = this.posts.map((post: Post) => {
      return html`<mg-post issingle="true" post=${JSON.stringify(post)} />`;
    });
    return html`${view}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mg-home': MgHome;
  }
}
