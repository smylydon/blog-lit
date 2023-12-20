import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';

import {Post} from './post';
import styles from './mg-post.scss';

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

  @property({type: Boolean, attribute: 'issingle'})
  isSingle = false;

  override render() {
    const post = this.model;
    const value = when(
      this.isSingle === true,
      () => html`<a @click=${this._onClickEdit}>Edit Post</a>`,
      () => html`<a @click=${this._onClickView}>View Post</a>`
    );

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

  private getEventObject(type: string): CustomEvent {
    return new CustomEvent(type, {
      detail: {
        id: this.model.id,
      },
      bubbles: true,
      composed: true,
    });
  }

  private _onClickEdit(event: Event) {
    event.preventDefault();
    this.dispatchEvent(this.getEventObject('edit-post'));
  }

  private _onClickView(event: Event) {
    event.preventDefault();
    this.dispatchEvent(this.getEventObject('view-post'));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mg-post': MgPost;
  }
}
