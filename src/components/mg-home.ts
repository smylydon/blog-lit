//import "./index.scss";
import {LitElement, html} from 'lit';
import {customElement, state} from 'lit/decorators.js';
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

  connectedCallback() {
    super.connectedCallback();
    console.log('addEventListeners');
    window.addEventListener('viewPost', this.changeView);
    window.addEventListener('editPost', this.changeView);
  }

  disconnectedCallback() {
    console.log('removeEventListener');

    window.removeEventListener('viewPost', this.changeView);
    window.removeEventListener('editPost', this.changeView);
    super.disconnectedCallback();
  }

  @state()
  view = 'list-post';

  @state()
  posts: Post[] = posts.map((post) => {
    post.date = new Date().toISOString();
    return post;
  }) as Post[];

  changeView(event: CustomEvent) {
    console.log('changeView');
    event.stopImmediatePropagation();
    const id = event.detail.id;
    const type = event.type;
    this.view = type;

    this.render();
  }

  override render(id = undefined) {
    const isSinglePost = ['view-post', 'edit-post'].includes(this.view);
    let view;
    if (isSinglePost) {
      const post = posts.find((post) => post.id === id);
      const value = post ? JSON.stringify(post) : JSON.stringify({});
      if (this.view === 'view-post') {
        view = html`<mg-post issingle="true" post=${value} />`;
      } else if (this.view === 'edit-post') {
        // will add new component
        view = html`<mg-post issingle="true" post=${value} />`;
      }
    } else {
      view = this.posts.map((post: Post) => {
        const value = JSON.stringify(post);
        return html`<mg-post issingle="false" post=${value} />`;
      });
    }
    return html`${view}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mg-home': MgHome;
  }
}
