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
    let value = html`<a @click=${this._onClickNew}>View Post</a>`;

    if (this.isSingle) {
      value = html`<a @click=${this._onClickEdit}>Edit Post</a>`;
    }
    return html`<article>
      <h2>${post.title}</h2>
      <p class="excerpt">${post.body}...</p>
      <p class="post-credit">
        ${value}
        <span>${post.name}</span>
      </p>
    </article> `;
  }

  private _onClickEdit(event: Event) {
    event.preventDefault();
    console.log('edit-post');
    this.dispatchEvent(new CustomEvent('edit-post'));
  }

  private _onClickNew(event: Event) {
    event.preventDefault();
    console.log('new-post');
    this.dispatchEvent(new CustomEvent('new-post'));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mg-post': MgPost;
  }
}
