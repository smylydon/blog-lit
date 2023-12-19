//import "./index.scss";
import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {Post} from './post';
import styles from './mg-post.scss';

/**
 * A blog element.
 *
 */
@customElement('mg-post')
export class MgPost extends LitElement {
  static override styles = styles;

  @property({attribute: 'post'})
  set setPost(post: string) {
    this.model = JSON.parse(post);
  }

  @property({attribute: false})
  model: Post = {
    title: '',
    userId: 0,
    body: '',
    name: '',
    id: 0,
  } as Post;

  @property({type: Object, attribute: 'is-single'})
  isSingle = false;

  override render() {
    const post = this.model;
    let value = html`<a @click=${this._onClickView}>View Post</a>`;

    if (this.isSingle) {
      value = html`<a @click=${this._onClickEdit}>Edit Post</a>`;
    }
    return html`<article>
      <h2>${post.title}</h2>
      <p class="excerpt">${post.body}...</p>
      <p class="post-credit">
        ${value}
        <span>${post.name}</span>
        <mg-time-ago timestamp="${post.date}"></mg-time-ago>
      </p>
    </article> `;
  }

  private _onClickEdit(event: Event) {
    event.preventDefault();

    this.dispatchEvent(
      new CustomEvent('edit-post', {
        detail: {
          id: this.model.id,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _onClickView(event: Event) {
    event.preventDefault();

    this.dispatchEvent(
      new CustomEvent('view-post', {
        detail: {
          id: this.model.id,
        },
        bubbles: true,
        composed: true,
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mg-post': MgPost;
  }
}
